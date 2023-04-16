"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeinfoGetEndpoint = void 0;
const respond_1 = require("./respond");
class NodeinfoGetEndpoint {
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
    respond = respond_1.respond;
}
exports.NodeinfoGetEndpoint = NodeinfoGetEndpoint;
//# sourceMappingURL=index.js.map