"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebfingerGetEndpoint = void 0;
const respond_1 = require("./respond");
class WebfingerGetEndpoint {
    req;
    res;
    lib;
    plugins;
    constructor(req, res, lib, plugins) {
        this.req = req;
        this.res = res;
        this.lib = lib;
        this.plugins = plugins;
    }
    respond = respond_1.respond;
}
exports.WebfingerGetEndpoint = WebfingerGetEndpoint;
//# sourceMappingURL=index.js.map