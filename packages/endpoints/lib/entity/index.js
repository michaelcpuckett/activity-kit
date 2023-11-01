"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGetEndpoint = void 0;
const handleNotFound_1 = require("./handleNotFound");
const handleFoundEntity_1 = require("./handleFoundEntity");
const handleFoundCollection_1 = require("./handleFoundCollection");
const handleFoundCollectionPage_1 = require("./handleFoundCollectionPage");
const respond_1 = require("./respond");
class EntityGetEndpoint {
    core;
    url;
    returnHtml;
    constructor(core, options) {
        this.core = core;
        this.url = options.url;
        this.returnHtml = options.returnHtml ?? false;
    }
    handleNotFound = handleNotFound_1.handleNotFound;
    handleFoundEntity = handleFoundEntity_1.handleFoundEntity;
    handleFoundCollection = handleFoundCollection_1.handleFoundCollection;
    handleFoundCollectionPage = handleFoundCollectionPage_1.handleFoundCollectionPage;
    respond = respond_1.respond;
}
exports.EntityGetEndpoint = EntityGetEndpoint;
//# sourceMappingURL=index.js.map