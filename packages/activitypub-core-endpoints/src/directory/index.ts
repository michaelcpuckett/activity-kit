import { Plugin } from 'activitypub-core-types';
import {
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { convertUrlsToStrings } from 'activitypub-core-utilities';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';

export class DirectoryGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    auth: AuthAdapter;
    db: DbAdapter;
  };
  plugins?: Plugin[];
  url: URL;

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      auth: AuthAdapter;
      db: DbAdapter;
    },
    plugins?: Plugin[],
    url?: URL,
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
    this.url = url ?? new URL(`${LOCAL_DOMAIN}${req.url}`);
  }

  public async respond(render: Function) {
    const groups = this.adapters.db.findAll('entity', {
      type: ['Group'],
    });

    console.log(groups);
    
    this.res.statusCode = 200;
    this.res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
    this.res.write(
      await render({
        groups: convertUrlsToStrings(groups),
      }),
    );
    this.res.end();
  }
}
