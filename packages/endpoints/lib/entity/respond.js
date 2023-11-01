"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
// TODO: Move to config.
const ITEMS_PER_COLLECTION_PAGE = 50;
async function respond(render) {
    const hasPage = this.url.href.includes('/page/');
    const pageParts = this.url.href.split('/page/');
    const baseUrl = hasPage ? new URL(pageParts[0]) : this.url;
    const entity = await this.core.findEntityById(baseUrl);
    if (!entity || !type_utilities_1.guard.isApEntity(entity)) {
        return await this.handleNotFound();
    }
    if (type_utilities_1.guard.isApCollection(entity)) {
        return handleCollection.bind(this)(entity, render);
    }
    return await this.handleFoundEntity(entity, render);
}
exports.respond = respond;
async function handleCollection(entity, render) {
    const hasPage = this.url.href.includes('/page/');
    const totalItems = entity.totalItems ?? 0;
    const lastPageIndex = Math.max(1, Math.ceil(totalItems / ITEMS_PER_COLLECTION_PAGE));
    const collectionEntity = {
        ...entity,
        totalItems,
        first: getPageUrl.bind(this)(1),
        last: getPageUrl.bind(this)(lastPageIndex),
    };
    if (!hasPage) {
        delete collectionEntity.orderedItems;
        delete collectionEntity.items;
        return await this.handleFoundCollection(collectionEntity, render);
    }
    if (type_utilities_1.guard.isApType(entity, AP.CollectionTypes.ORDERED_COLLECTION)) {
        const orderedCollectionPageEntity = {
            ...collectionEntity,
            type: AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
        };
        return await this.handleFoundCollectionPage(orderedCollectionPageEntity, render);
    }
    const collectionPageEntity = {
        ...collectionEntity,
        type: AP.CollectionPageTypes.COLLECTION_PAGE,
    };
    return await this.handleFoundCollectionPage(collectionPageEntity, render);
}
function getPageUrl(page) {
    const pathname = this.url.pathname === '/' ? '' : this.url.pathname;
    const pageUrl = `${pathname}/page/${page}`;
    return new URL(pageUrl, this.url.origin);
}
//# sourceMappingURL=respond.js.map