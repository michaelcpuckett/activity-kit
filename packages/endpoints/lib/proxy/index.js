"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyGetEndpoint = void 0;
const utilities_1 = require("@activity-kit/utilities");
class ProxyGetEndpoint {
    req;
    res;
    core;
    plugins;
    constructor(req, res, core, plugins) {
        this.req = req;
        this.res = res;
        this.core = core;
        this.plugins = plugins;
    }
    async respond() {
        try {
            const urlObject = new URL(this.req.url, utilities_1.LOCAL_DOMAIN);
            const proxiedUrl = new URL(urlObject.searchParams.get('resource'));
            if (proxiedUrl) {
                const acceptHeader = this.req.headers.accept.includes('*/*')
                    ? utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE
                    : this.req.headers.accept;
                const fetchedResult = acceptHeader !== utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE
                    ? await this.lib
                        .fetch(proxiedUrl.toString(), {
                        headers: {
                            Accept: acceptHeader,
                        },
                    })
                        .then((response) => response.json())
                    : await this.core.queryById(proxiedUrl);
                if (fetchedResult) {
                    this.res.statusCode = 200;
                    this.res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
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