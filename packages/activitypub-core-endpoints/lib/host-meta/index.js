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
        const hostMeta = {
            "links": [
                {
                    "rel": "lrdd",
                    "template": `${activitypub_core_utilities_1.LOCAL_DOMAIN}/.well-known/webfinger?resource={uri}`
                }
            ]
        };
        this.res.statusCode = 200;
        this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JRD_CONTENT_TYPE);
        this.res.write(JSON.stringify(hostMeta));
        this.res.end();
        return;
    }
}
exports.HostMetaGetEndpoint = HostMetaGetEndpoint;
//# sourceMappingURL=index.js.map