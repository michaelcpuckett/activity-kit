import type { IncomingMessage, ServerResponse } from 'http';
import {
  CONTENT_TYPE_HEADER,
  JRD_CONTENT_TYPE,
  XRD_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { Plugin } from 'activitypub-core-types';
import { AuthLayer } from 'activitypub-core-auth-layer';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';

export class HostMetaGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  layers: {
    auth: AuthLayer;
    data: DataLayer;
    storage: StorageLayer;
  };
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    layers: {
      auth: AuthLayer;
      data: DataLayer;
      storage: StorageLayer;
    },
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.layers = layers;
    this.plugins = plugins;
  }

  public async respond() {
    this.res.setHeader('Vary', 'Accept');
    this.res.statusCode = 200;

    if (
      this.req.headers.accept?.includes(JSON_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(JRD_CONTENT_TYPE)
    ) {
      const hostMeta = {
        links: [
          {
            rel: 'lrdd',
            template: `${LOCAL_DOMAIN}/.well-known/webfinger?resource={uri}`,
          },
        ],
      };

      this.res.setHeader(CONTENT_TYPE_HEADER, JRD_CONTENT_TYPE);
      this.res.write(JSON.stringify(hostMeta));
    } else {
      this.res.setHeader(CONTENT_TYPE_HEADER, XRD_CONTENT_TYPE);
      this.res.write(
        `<?xml version="1.0" encoding="UTF-8" ?>
        <XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
          <Link
            rel="lrdd"
            template="${LOCAL_DOMAIN}/.well-known/webfinger?resource={uri}"
          />
        </XRD>
      `.trim(),
      );
    }

    this.res.end();
  }
}
