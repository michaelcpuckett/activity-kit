"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebfingerGetEndpoint = void 0;
const respond_1 = require("./respond");
class WebfingerGetEndpoint {
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
exports.WebfingerGetEndpoint = WebfingerGetEndpoint;
//# sourceMappingURL=index.js.map