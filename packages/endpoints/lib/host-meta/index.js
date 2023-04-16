"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostMetaGetEndpoint = void 0;
const utilities_1 = require("@activity-kit/utilities");
class HostMetaGetEndpoint {
    req;
    res;
    lib;
    plugins;
    constructor(req, res, lib, plugins) {
        this.req = req;
        this.res = res;
        this.core = core;
        this.plugins = plugins;
    }
    async respond() {
        this.res.setHeader('Vary', 'Accept');
        this.res.statusCode = 200;
        if (this.req.headers.accept?.includes(utilities_1.JSON_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(utilities_1.JRD_CONTENT_TYPE)) {
            const hostMeta = {
                links: [
                    {
                        rel: 'lrdd',
                        template: `${utilities_1.LOCAL_DOMAIN}/.well-known/webfinger?resource={uri}`,
                    },
                ],
            };
            this.res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.JRD_CONTENT_TYPE);
            this.res.write(JSON.stringify(hostMeta));
        }
        else {
            this.res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.XRD_CONTENT_TYPE);
            this.res.write(`<?xml version="1.0" encoding="UTF-8" ?>
        <XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
          <Link
            rel="lrdd"
            template="${utilities_1.LOCAL_DOMAIN}/.well-known/webfinger?resource={uri}"
          />
        </XRD>
      `.trim());
        }
        this.res.end();
    }
}
exports.HostMetaGetEndpoint = HostMetaGetEndpoint;
//# sourceMappingURL=index.js.map