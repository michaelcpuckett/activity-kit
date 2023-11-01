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
// TODO: Move to config.
const ITEMS_PER_COLLECTION_PAGE = 50;
async function handleFoundCollectionPage(entity, render) {
    const pageParts = this.url.href.split('/page/');
    const getPageUrl = (page) => new URL(`${this.url.pathname === '/' ? '' : this.url.pathname}/page/${page}`, this.url.origin);
    const page = pageParts[1];
    const currentPage = page ? Number(page) : 1;
    const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE;
    const startIndex = firstItemIndex + 1;
    const limitedItems = getCollectionItems(entity).slice(firstItemIndex, firstItemIndex + ITEMS_PER_COLLECTION_PAGE);
    const items = expandItems(limitedItems);
    const collectionPage = {
        ...entity,
        id: getPageUrl(currentPage),
        url: getPageUrl(currentPage),
        partOf: baseUrl,
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
    if (isOrderedCollection) {
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
    return objects.map((object) => {
        if (type_utilities_1.guard.isApLink(object)) {
            return object;
        }
        if (type_utilities_1.guard.isApMention(object)) {
            return object;
        }
        if (type_utilities_1.guard.isApObject(object)) {
            return {
                ...object,
                id: getId(object),
                url: new URL(getId(object)),
            };
        }
        return object;
    });
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
function foo() {
    const items = [];
    for (const item of limitedItems) {
        if (type_utilities_1.guard.isApTransitiveActivity(item)) {
            const objectId = getId(item.object);
            if (objectId) {
                const object = await this.core.findEntityById(objectId);
                if (object) {
                    item.object = object;
                }
            }
        }
        if (type_utilities_1.guard.isApEntity(item)) {
            items.push(item);
        }
    }
    return items;
}
//# sourceMappingURL=handleFoundCollectionPage.js.map