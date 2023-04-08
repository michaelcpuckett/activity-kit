import type { IncomingMessage, ServerResponse } from 'http';
import {
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  LOCAL_HOSTNAME,
} from 'activitypub-core-utilities';
import type { DbAdapter } from 'activitypub-core-types';

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
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
  }

  public async respond() {
    try {
      const urlObject = new URL(this.req.url, LOCAL_HOSTNAME);
      const proxiedUrl = new URL(
        decodeURI(urlObject.searchParams.get('resource')),
      );
      const acceptHeader =
        this.req.headers.accept || ACTIVITYSTREAMS_CONTENT_TYPE;

      if (proxiedUrl) {
        const fetchedResult =
          acceptHeader !== ACTIVITYSTREAMS_CONTENT_TYPE
            ? await this.adapters.db.adapters
                .fetch(proxiedUrl.toString(), {
                  headers: {
                    Accept: acceptHeader,
                  },
                })
                .then((response) => response.json())
            : await this.adapters.db.queryById(proxiedUrl);

        if (fetchedResult) {
          this.res.statusCode = 200;
          this.res.setHeader(CONTENT_TYPE_HEADER, ACTIVITYSTREAMS_CONTENT_TYPE);
          this.res.write(JSON.stringify(fetchedResult));
          this.res.end();
          return;
        }
      }
    } catch (error) {
      this.res.statusCode = 404;
      this.res.end();
    }

    this.res.statusCode = 404;
    this.res.end();
  }
}
