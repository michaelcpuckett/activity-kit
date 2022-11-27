import type { IncomingMessage, ServerResponse } from 'http';
import {
  CONTENT_TYPE_HEADER,
  JRD_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import type { DbAdapter, Plugin } from 'activitypub-core-types';

export class HostMetaGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    db: DbAdapter;
  };

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      db: DbAdapter;
    },
    plugins: Plugin[]
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
  }

  public async respond() {
    const hostMeta = {
      "links": [
        {
          "rel": "lrdd",
          "template": `${LOCAL_DOMAIN}/.well-known/webfinger?resource={uri}`
        }
      ]
    };

    this.res.statusCode = 200;
    this.res.setHeader(CONTENT_TYPE_HEADER, JRD_CONTENT_TYPE);
    this.res.write(JSON.stringify(hostMeta));
    this.res.end();
    return;
  }
}
