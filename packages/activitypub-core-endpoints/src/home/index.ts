import { IncomingMessage } from 'http';
import { AP, Plugin } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACTIVITYSTREAMS_CONTENT_TYPE_WITH_PROFILE,
  CONTENT_TYPE_HEADER,
  convertUrlsToStrings,
  HTML_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
} from 'activitypub-core-utilities';
import cookie from 'cookie';
import type { ServerResponse } from 'http';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import { stringify } from 'activitypub-core-utilities';

export class HomeGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    auth: AuthAdapter;
    db: DbAdapter;
  };
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      auth: AuthAdapter;
      db: DbAdapter;
    },
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
  }

  public async respond(render: Function) {
    const cookies = cookie.parse(this.req.headers.cookie ?? '');

    const actor = await this.adapters.db.getActorByUserId(
      await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''),
    );

    if (!actor) {
      this.res.statusCode = 302;
      this.res.setHeader('Location', '/login');
      this.res.end();
      return;
    }

    if (!actor.inbox || !actor.outbox) {
      throw new Error('Bad actor.');
    }

    actor.inbox = await this.adapters.db.findEntityById(actor.inbox);
    actor.outbox = await this.adapters.db.findEntityById(actor.outbox);

    this.res.statusCode = 200;
    this.res.setHeader('Vary', 'Accept');

    if (
      this.req.headers.accept?.includes(ACTIVITYSTREAMS_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(LINKED_DATA_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(JSON_CONTENT_TYPE)
    ) {
      this.res.setHeader(CONTENT_TYPE_HEADER, ACTIVITYSTREAMS_CONTENT_TYPE);
      this.res.write(stringify(actor));
    } else {
      this.res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);

      let props = {
        actor,
      };

      if (this.plugins) {
        for (const plugin of this.plugins) {
          if ('getHomePageProps' in plugin && plugin.getHomePageProps) {
            props = {
              ...props,
              ...(await plugin.getHomePageProps(actor, this.req.url)),
            };
          }
        }
      }

      const formattedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => {
        return [key, convertUrlsToStrings(value)];
      }));

      this.res.write(
        await render(formattedProps),
      );
    }

    this.res.end();
  }
}
