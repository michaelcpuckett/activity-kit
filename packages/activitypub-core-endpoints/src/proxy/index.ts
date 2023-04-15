import type { IncomingMessage, ServerResponse } from 'http';
import {
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { AuthLayer } from 'activitypub-core-auth-layer';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';

export class ProxyGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  layers: {
    auth: AuthLayer;
    data: DataLayer;
    storage: StorageLayer;
  };

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    layers: {
      auth: AuthLayer;
      data: DataLayer;
      storage: StorageLayer;
    },
  ) {
    this.req = req;
    this.res = res;
    this.layers = layers;
  }

  public async respond() {
    try {
      const urlObject = new URL(this.req.url, LOCAL_DOMAIN);
      const proxiedUrl = new URL(urlObject.searchParams.get('resource'));

      if (proxiedUrl) {
        const acceptHeader = this.req.headers.accept.includes('*/*')
          ? ACTIVITYSTREAMS_CONTENT_TYPE
          : this.req.headers.accept;

        const fetchedResult =
          acceptHeader !== ACTIVITYSTREAMS_CONTENT_TYPE
            ? await this.layers.data
                .fetch(proxiedUrl.toString(), {
                  headers: {
                    Accept: acceptHeader,
                  },
                })
                .then((response) => response.json())
            : await this.layers.data.queryById(proxiedUrl);

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
