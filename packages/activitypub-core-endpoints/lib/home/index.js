"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeGetEndpoint = void 0;
const respond_1 = require("./respond");
class HomeGetEndpoint {
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
exports.HomeGetEndpoint = HomeGetEndpoint;
//# sourceMappingURL=index.js.map