"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebfingerGetEndpoint = void 0;
const respond_1 = require("./respond");
class WebfingerGetEndpoint {
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
exports.WebfingerGetEndpoint = WebfingerGetEndpoint;
//# sourceMappingURL=index.js.map