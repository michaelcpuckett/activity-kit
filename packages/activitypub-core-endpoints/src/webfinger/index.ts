import type { IncomingMessage, ServerResponse } from 'http';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
  JRD_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LOCAL_DOMAIN,
  LOCAL_HOSTNAME,
  XRD_CONTENT_TYPE,
} from 'activitypub-core-utilities';
import * as queryString from 'query-string';
import type { DbAdapter, Plugin } from 'activitypub-core-types';

export class WebfingerGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    db: DbAdapter;
  };
  plugins: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      db: DbAdapter;
    },
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
  }

  private handleNotFound() {
    this.res.statusCode = 404;
    this.res.end();
  }

  public async respond() {
    this.res.setHeader('Vary', 'Accept');

    const query = new URL(this.req.url, LOCAL_DOMAIN).searchParams;
    const resource = query.get('resource') ?? '';

    if (!resource.startsWith('acct:')) {
      this.handleNotFound();
    }

    const [account] = resource.split('@');
    const [, username] = account.split(':');

    if (!username) {
      return this.handleNotFound();
    }
    
    const actor = await this.adapters.db.findOne('entity', {
      preferredUsername: username,
    });

    if (!actor) {
      return this.handleNotFound();
    }

    this.res.statusCode = 200;

    if (
      this.req.headers.accept?.includes(JSON_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(JRD_CONTENT_TYPE)
    ) {
      const finger = {
        subject: `acct:${username}@${LOCAL_HOSTNAME}`,
        aliases: [
          actor.url.toString(),
        ],
        links: [
          {
            rel: 'http://webfinger.net/rel/profile-page',
            type: HTML_CONTENT_TYPE,
            href: actor.url.toString(),
          },
          {
            rel: 'self',
            type: ACTIVITYSTREAMS_CONTENT_TYPE,
            href: actor.url.toString(),
          },
        ],
      };

      this.res.setHeader(CONTENT_TYPE_HEADER, JRD_CONTENT_TYPE);
      this.res.write(JSON.stringify(finger));
    } else {
      const finger = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
          Subject>acct:${username}@${LOCAL_HOSTNAME}</Subject>
          <Alias>${actor.url.toString()}</Alias>
          <Link
            rel="http://webfinger.net/rel/profile-page"
            type="${HTML_CONTENT_TYPE}"
            href="${actor.url.toString()}"
          />
          <Link
            rel="self"
            type="${ACTIVITYSTREAMS_CONTENT_TYPE}"
            href="${actor.url.toString()}"
          />
        </XRD>
      `.trim();

      this.res.setHeader(CONTENT_TYPE_HEADER, XRD_CONTENT_TYPE);
      this.res.write(finger);
    }

    this.res.end();
  }
}
