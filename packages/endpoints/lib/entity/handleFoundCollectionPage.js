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
exports.handleFoundCollectionPage = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
// TODO: Move to config.
const ITEMS_PER_COLLECTION_PAGE = 50;
async function handleFoundCollectionPage(entity, render) {
    const pageParts = this.url.href.split('/page/');
    const getPageUrl = (page) => new URL(`${this.url.pathname === '/' ? '' : this.url.pathname}/page/${page}`, this.url.origin);
    const page = pageParts[1];
    const currentPage = page ? Number(page) : 1;
    const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE;
    const startIndex = firstItemIndex + 1;
    const collection = await this.core.queryById(new URL(pageParts[0]));
    type_utilities_1.assert.isApCollection(collection);
    const collectionItems = getCollectionItems(collection);
    const lastPageIndex = Math.ceil(collectionItems.length / ITEMS_PER_COLLECTION_PAGE);
    const limitedItems = collectionItems.slice(firstItemIndex, firstItemIndex + ITEMS_PER_COLLECTION_PAGE);
    const items = expandItems(limitedItems);
    const collectionId = (0, utilities_1.getId)(collection);
    type_utilities_1.assert.exists(collectionId);
    const collectionPage = {
        ...entity,
        id: getPageUrl(currentPage),
        url: getPageUrl(currentPage),
        partOf: collectionId,
        first: getPageUrl(1),
        last: getPageUrl(lastPageIndex),
        ...(currentPage > 1
            ? {
                prev: getPageUrl(currentPage - 1),
            }
            : null),
        ...(currentPage < lastPageIndex
            ? {
                next: getPageUrl(currentPage + 1),
            }
            : null),
    };
    if (type_utilities_1.guard.isApType(collection, AP.CollectionTypes.ORDERED_COLLECTION)) {
        const orderedCollectionPageEntity = {
            ...collectionPage,
            type: AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
            orderedItems: items,
            startIndex,
        };
        return this.handleFoundEntity(orderedCollectionPageEntity, render);
    }
    const collectionPageEntity = {
        ...collectionPage,
        type: AP.CollectionPageTypes.COLLECTION_PAGE,
        items: items,
    };
    return this.handleFoundEntity(collectionPageEntity, render);
}
exports.handleFoundCollectionPage = handleFoundCollectionPage;
function expandItems(objects) {
    return objects
        .map((object) => {
        if (type_utilities_1.guard.isApType(object, AP.LinkTypes.LINK)) {
            return object;
        }
        if (type_utilities_1.guard.isApType(object, AP.LinkTypes.MENTION)) {
            return object;
        }
        if (type_utilities_1.guard.isApCoreObject(object)) {
            const id = (0, utilities_1.getId)(object);
            if (type_utilities_1.guard.exists(id)) {
                return {
                    ...object,
                    id,
                    url: id,
                };
            }
        }
        return object;
    })
        .filter(type_utilities_1.guard.isApEntity);
}
function getCollectionItems(collection) {
    if (type_utilities_1.guard.isArray(collection.orderedItems)) {
        return collection.orderedItems;
    }
    if (type_utilities_1.guard.isArray(collection.items)) {
        return collection.items;
    }
    return [];
}
//# sourceMappingURL=handleFoundCollectionPage.js.map