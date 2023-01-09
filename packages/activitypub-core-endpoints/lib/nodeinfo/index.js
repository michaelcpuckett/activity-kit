"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeinfoGetEndpoint = void 0;
const respond_1 = require("./respond");
class NodeinfoGetEndpoint {
    req;
    res;
    adapters;
    plugins;
    constructor(req, res, adapters, plugins) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
    }
    respond = respond_1.respond;
}
exports.NodeinfoGetEndpoint = NodeinfoGetEndpoint;
//# sourceMappingURL=index.js.map