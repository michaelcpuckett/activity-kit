import type { IncomingMessage, ServerResponse } from 'http';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
  JRD_CONTENT_TYPE,
  LOCAL_DOMAIN,
  LOCAL_HOSTNAME,
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

  public async respond() {
    const query = {
      ...queryString.parse(new URL(this.req.url, LOCAL_DOMAIN).search),
    } as { [key: string]: string };
    const resource = query.resource ?? '';
    const [account] = resource.split('@');
    const [, username] = account.split(':');

    if (username) {
      const actor = await this.adapters.db.findOne('actor', {
        preferredUsername: username,
      });

      if (actor) {
        const finger = {
          subject: `acct:${username}@${LOCAL_HOSTNAME}`,
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

        this.res.statusCode = 200;
        this.res.setHeader(CONTENT_TYPE_HEADER, JRD_CONTENT_TYPE);
        this.res.write(JSON.stringify(finger));
        this.res.end();
        return;
      }
    }

    this.res.statusCode = 404;
    this.res.end();
  }
}
