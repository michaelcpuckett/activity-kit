"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyGetEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
class ProxyGetEndpoint {
    req;
    res;
    adapters;
    constructor(req, res, adapters) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
    }
    async respond() {
        try {
            const urlObject = new URL(this.req.url, activitypub_core_utilities_1.LOCAL_DOMAIN);
            const proxiedUrl = new URL(decodeURI(urlObject.searchParams.get('resource')));
            const acceptHeader = this.req.headers.accept || activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE;
            if (proxiedUrl) {
                const fetchedResult = acceptHeader !== activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE
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
                    this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
                    this.res.write(JSON.stringify(fetchedResult));
                    this.res.end();
                    return;
                }
            }
        }
        catch (error) {
            this.res.statusCode = 404;
            this.res.end();
        }
        this.res.statusCode = 404;
        this.res.end();
    }
}
exports.ProxyGetEndpoint = ProxyGetEndpoint;
//# sourceMappingURL=index.js.map