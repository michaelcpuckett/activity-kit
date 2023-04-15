import type { IncomingMessage, ServerResponse } from 'http';
import {
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { Library, Plugin } from 'activitypub-core-types';

export class ProxyGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  lib: Library;
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    lib: Library,
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.lib = lib;
    this.plugins = plugins;
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
            ? await this.lib
                .fetch(proxiedUrl.toString(), {
                  headers: {
                    Accept: acceptHeader,
                  },
                })
                .then((response) => response.json())
            : await this.lib.queryById(proxiedUrl);

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
