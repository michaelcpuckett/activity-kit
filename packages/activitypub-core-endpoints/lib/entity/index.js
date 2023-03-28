"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGetEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const handleFoundEntity_1 = require("./handleFoundEntity");
const respond_1 = require("./respond");
class EntityGetEndpoint {
    req;
    res;
    adapters;
    plugins;
    routes;
    url;
    constructor(req, res, adapters, plugins, url) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
        this.url = url ?? new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${req.url}`);
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