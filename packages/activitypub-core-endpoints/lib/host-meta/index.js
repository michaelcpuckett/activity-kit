"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostMetaGetEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
class HostMetaGetEndpoint {
    req;
    res;
    adapters;
    constructor(req, res, adapters, plugins) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
    }
    async respond() {
        this.res.setHeader('Vary', 'Accept');
        this.res.statusCode = 200;
        if (this.req.headers.accept?.includes(activitypub_core_utilities_1.JSON_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.JRD_CONTENT_TYPE)) {
            const hostMeta = {
                "links": [
                    {
                        "rel": "lrdd",
                        "template": `${activitypub_core_utilities_1.LOCAL_DOMAIN}/.well-known/webfinger?resource={uri}`
                    }
                ]
            };
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JRD_CONTENT_TYPE);
            this.res.write(JSON.stringify(hostMeta));
        }
        else {
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.XRD_CONTENT_TYPE);
            this.res.write(`
        <?xml version="1.0" encoding="UTF-8" ?>
        <XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
          <Link
            rel="lrdd"
            template="${activitypub_core_utilities_1.LOCAL_DOMAIN}/.well-known/webfinger?resource={uri}"
          />
        </XRD>
      `);
        }
        this.res.end();
        return;
    }
}
exports.HostMetaGetEndpoint = HostMetaGetEndpoint;
//# sourceMappingURL=index.js.map