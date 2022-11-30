import type { IncomingMessage, ServerResponse } from 'http';
import {
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE
} from 'activitypub-core-utilities';
import type { DbAdapter, Plugin } from 'activitypub-core-types';

export class ProxyGetEndpoint {
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
    const proxiedUrl = this.req.url?.split('?resource=')[1];

    if (proxiedUrl) {
      const fetchedResult = await this.adapters.db.queryById(new URL(proxiedUrl));
      
      if (fetchedResult) {
        this.res.statusCode = 200;
        this.res.setHeader(CONTENT_TYPE_HEADER, ACTIVITYSTREAMS_CONTENT_TYPE)
        this.res.write(JSON.stringify(fetchedResult));
        this.res.end();
        return;
      }
    }

    this.res.statusCode = 404;
    this.res.end();
  }
}
