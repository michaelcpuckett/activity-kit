"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGetEndpoint = void 0;
const utilities_1 = require("@activity-kit/utilities");
const handleFoundEntity_1 = require("./handleFoundEntity");
const respond_1 = require("./respond");
class EntityGetEndpoint {
    req;
    res;
    lib;
    plugins;
    routes;
    url;
    constructor(req, res, lib, plugins, url) {
        this.req = req;
        this.res = res;
        this.core = core;
        this.plugins = plugins;
        this.url = url ?? new URL(req.url, utilities_1.LOCAL_DOMAIN);
    }
    handleFoundEntity = handleFoundEntity_1.handleFoundEntity;
    handleBadRequest() {
        this.res.statusCode = 500;
        this.res.write('Bad request');
        this.res.end();
        return {
            props: {},
        };
    }
    handleNotFound() {
        this.res.statusCode = 404;
        this.res.write('Not found');
        this.res.end();
        return {
            props: {},
        };
    }
    respond = respond_1.respond;
}
exports.EntityGetEndpoint = EntityGetEndpoint;
//# sourceMappingURL=index.js.map