"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeinfoGetEndpoint = void 0;
const respond_1 = require("./respond");
class NodeinfoGetEndpoint {
    req;
    res;
    layers;
    plugins;
    constructor(req, res, layers, plugins) {
        this.req = req;
        this.res = res;
        this.layers = layers;
        this.plugins = plugins;
    }
    respond = respond_1.respond;
}
exports.NodeinfoGetEndpoint = NodeinfoGetEndpoint;
//# sourceMappingURL=index.js.map