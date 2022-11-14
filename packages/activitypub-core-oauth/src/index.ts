import { Provider } from 'oidc-provider';
import type { Configuration, ClientMetadata } from 'oidc-provider';
import { LOCAL_DOMAIN, parseStream } from 'activitypub-core-utilities';
import type { AuthAdapter, DbAdapter } from 'activitypub-core-types';
import { IncomingMessage, ServerResponse } from 'http';

export const oidcRouteHandler = ({
  client_id,
  client_secret,
  redirect_uris,
  adapters
}: {
  client_id: string,
  client_secret: string;
  redirect_uris: string[],
  adapters: {
    db: DbAdapter,
    auth: AuthAdapter,
  }
}) => {
  const client: ClientMetadata = {
    client_id,
    client_secret,
    redirect_uris,
    response_types: ['id_token'],
    grant_types: ['implicit'],
    token_endpoint_auth_method: 'none',
  };

  const configuration: Configuration = {
    clients: [
      client,
    ],

    pkce: {
      methods: [
        'S256',
      ],
      required: () => false,
    },
    
    // let's tell oidc-provider you also support the email scope, which will contain email and
    // email_verified claims
    claims: {
      openid: ['sub'],
      email: ['email', 'email_verified'],
    },
  
    // let's tell oidc-provider where our own interactions will be
    // setting a nested route is just good practice so that users
    // don't run into weird issues with multiple interactions open
    // at a time.
    interactions: {
      url(ctx, interaction) {
        return `/interaction/${interaction.uid}`;
      },
    },

    features: {
      // disable the packaged interactions
      devInteractions: { enabled: false },
    },
    
    // This interface is required by oidc-provider
    async findAccount(ctx, id) {
      const actor = await adapters.db.getActorByUserId(id);

      if (!actor) {
        return undefined;
      }

      const email = this.adapters.db.getStringValueById('account', id);

      if (!email) {
        return undefined;
      }

      return {
        accountId: id,
        // and this claims() method would actually query to retrieve the account claims
        async claims() {
          return {
            sub: id,
            email,
            email_verified: true, // TODO
          };
        },
      };
    },
  };

  const oidc = new Provider(LOCAL_DOMAIN, configuration);

  return {
    oidc: oidc.callback(),
    interactio: async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const details = await oidc.interactionDetails(req, res);
        const {
          uid,
          prompt,
        } = details;
    
        if (prompt.name === 'login') {
          res.statusCode = 200; // TODO
          res.setHeader('Accept', 'text/html');
          res.write(`
            <!doctype html>
            <html>
              <body>
                <h1>Sign In</h1>
                <textarea>${JSON.stringify(prompt.details)}</textarea>
                <form>
                  <label>
                    <span>
                      Email
                    </span>
                    <input type="email" name="email" />
                  </label>
                  <label>
                    <span>
                      Password
                    </span>
                    <input type="password" name="password" />
                  </label>
                </form>
              </body>
            </html>
          `);
          res.end();
          return;
        }
        
        res.statusCode = 200; // TODO
        res.setHeader('Accept', 'text/html');
        res.write(`
          <!doctype html>
          <html>
            <body>
              <h1>Authorize</h1>
              <form autocomplete="off" action="/interaction/${uid}/confirm" method="post">
                <button autofocus type="submit">
                  Continue
                </button>
              </form>
            </body>
          </html>
        `);
        res.end();
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Accept', 'text/html');
        res.write(JSON.stringify(err));
      }
    },
    abort: async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const result = {
          error: 'access_denied',
          error_description: 'End-User aborted interaction',
        };
        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Accept', 'text/html');
        res.write(JSON.stringify(err));
      }
    },
    confirm: async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const interactionDetails = await oidc.interactionDetails(req, res);
        const params = interactionDetails.params;
        const details = interactionDetails.prompt.details;
        const accountId = interactionDetails.session?.accountId;
        const clientId = params.clientId as string;
    
        let { grantId } = interactionDetails;
        let grant;
    
        if (grantId) {
          // we'll be modifying existing grant in existing session
          grant = await oidc.Grant.find(grantId);
        } else {
          // we're establishing a new grant
          grant = new oidc.Grant({
            accountId,
            clientId,
          });
        }
    
        if (details.missingOIDCScope) {
          grant.addOIDCScope(Object.values(details.missingOIDCScope).join(' ')); // TODO
          // use grant.rejectOIDCScope to reject a subset or the whole thing
        }
        if (details.missingOIDCClaims) {
          grant.addOIDCClaims(details.missingOIDCClaims);
          // use grant.rejectOIDCClaims to reject a subset or the whole thing
        }
        if (details.missingResourceScopes) {
          for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
            grant.addResourceScope(indicator, scopes.joi(' '));
            // use grant.rejectResourceScope to reject a subset or the whole thing
          }
        }
    
        grantId = await grant.save();
    
        const consent = {};
        if (!interactionDetails.grantId) {
          // we don't have to pass grantId to consent, we're just modifying existing one
          (consent as {
            grantId?: string;
          }).grantId = grantId;
        }
    
        const result = { consent };
        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Accept', 'text/html');
        res.write(JSON.stringify(err));
      }
    },
    login: async (req: IncomingMessage, res: ServerResponse) => {
      // This can be anything you need to authenticate a user
      async function authenticate(email: string, password: string) {
        try {
          const id = this.adapters.db.getStringIdByValue('account', email);
          const isAuthenticated = await this.adapters.auth.authenticatePassword(email, password);

          if (!isAuthenticated) {
            return undefined;
          }

          return id;
        } catch (err) {
          return undefined;
        }
      }

      try {
        const { prompt } = await oidc.interactionDetails(req, res);

        const body = await parseStream(req) as unknown as {
          email: string;
          password: string;
        };

        const accountId = await authenticate(body.email, body.password);

        if (!accountId) {
          res.statusCode = 200; // TODO
          res.setHeader('Accept', 'text/html');
          res.write(`
            <!doctype html>
            <html>
              <body>
                <h1>Sign In</h1>
                <p>Invalid email or password!</p>
                <textarea>${JSON.stringify(prompt.details)}</textarea>
                <form>
                  <label>
                    <span>
                      Email
                    </span>
                    <input type="email" name="email" value="${body.email}" />
                  </label>
                  <label>
                    <span>
                      Password
                    </span>
                    <input type="password" name="password" />
                  </label>
                </form>
              </body>
            </html>
          `);
          res.end();
          return;
        }

        const result = {
          login: { accountId },
        };

        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Accept', 'text/html');
        res.write(JSON.stringify(err));
      }
    }
  }
};