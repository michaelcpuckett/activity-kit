import type { IncomingMessage, ServerResponse } from 'http';
import {
  CONTENT_TYPE_HEADER,
  JRD_CONTENT_TYPE,
  XRD_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from '@activity-kit/utilities';
import { CoreLibrary, Plugin } from '@activity-kit/core';

export class HostMetaGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  core: CoreLibrary;
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    core: CoreLibrary,
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.core = core;
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
