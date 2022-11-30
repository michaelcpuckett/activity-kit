"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyGetEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
class ProxyGetEndpoint {
    req;
    res;
    adapters;
    constructor(req, res, adapters, plugins) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
    }
    async respond() {
        const proxiedUrl = this.req.url?.split('?resource=')[1];
        if (proxiedUrl) {
            const fetchedResult = await this.adapters.db.queryById(proxiedUrl);
            if (fetchedResult) {
                this.res.statusCode = 200;
                this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
                this.res.write(JSON.stringify(fetchedResult));
                this.res.end();
                return;
            }
        }
        this.res.statusCode = 404;
        this.res.end();
    }
}
exports.ProxyGetEndpoint = ProxyGetEndpoint;
//# sourceMappingURL=index.js.map