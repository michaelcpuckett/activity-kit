"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGetEndpoint = void 0;
const handleFoundEntity_1 = require("./handleFoundEntity");
const respond_1 = require("./respond");
class EntityGetEndpoint {
    core;
    url;
    returnHtml;
    constructor(core, options) {
        this.core = core;
        this.url = options.url;
        this.returnHtml = options.returnHtml;
    }
    handleFoundEntity = handleFoundEntity_1.handleFoundEntity;
    handleBadRequest() {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Bad request',
            }),
        };
    }
    handleNotFound() {
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'Not found',
            }),
        };
    }
    respond = respond_1.respond;
}
exports.EntityGetEndpoint = EntityGetEndpoint;
//# sourceMappingURL=index.js.map