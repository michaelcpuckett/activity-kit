"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGetEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const handleFoundEntity_1 = require("./handleFoundEntity");
const respond_1 = require("./respond");
class EntityGetEndpoint {
    req;
    res;
    layers;
    plugins;
    routes;
    url;
    constructor(req, res, layers, plugins, url) {
        this.req = req;
        this.res = res;
        this.layers = layers;
        this.plugins = plugins;
        this.url = url ?? new URL(req.url, activitypub_core_utilities_1.LOCAL_DOMAIN);
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