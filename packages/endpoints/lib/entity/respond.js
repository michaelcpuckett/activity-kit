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
const ITEMS_PER_COLLECTION_PAGE = 50;
async function respond(render) {
    const hasPage = this.url.href.includes('/page/');
    const pageParts = this.url.href.split('/page/');
    const baseUrl = hasPage ? new URL(pageParts[0]) : this.url;
    const entity = await this.core.findEntityById(baseUrl);
    try {
        type_utilities_1.assert.isApEntity(entity);
    }
    catch (error) {
        return this.handleNotFound();
    }
    if (!type_utilities_1.guard.isTypeOf(entity, AP.CollectionTypes) &&
        !type_utilities_1.guard.isTypeOf(entity, AP.CollectionPageTypes)) {
        return this.handleFoundEntity(entity, render);
    }
    type_utilities_1.assert.isApCollection(entity);
    const totalItems = Number(entity.totalItems);
    const lastPageIndex = Math.max(1, Math.ceil(totalItems / ITEMS_PER_COLLECTION_PAGE));
    const isOrderedCollection = type_utilities_1.guard.isApType(entity, AP.CollectionTypes.ORDERED_COLLECTION);
    const getPageUrl = (page) => new URL(`${this.url.pathname === '/' ? '' : this.url.pathname}/page/${page}`, this.url.origin);
    const page = pageParts[1];
    const currentPage = page ? Number(page) : 1;
    const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE;
    const startIndex = firstItemIndex + 1;
    if (!hasPage) {
        type_utilities_1.assert.isApCollection(entity);
        delete entity.orderedItems;
        delete entity.items;
        const collectionEntity = {
            ...entity,
            first: getPageUrl(1),
            last: getPageUrl(lastPageIndex),
        };
        return this.handleFoundEntity(collectionEntity, render);
    }
    const expandedCollection = await this.core.expandCollection(entity);
    const expandedItems = (() => {
        if (Array.isArray(expandedCollection.type)
            ? expandedCollection.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
            : expandedCollection.type === AP.CollectionTypes.ORDERED_COLLECTION) {
            return expandedCollection.orderedItems;
        }
        if (Array.isArray(expandedCollection.type)
            ? expandedCollection.type.includes(AP.CollectionTypes.COLLECTION)
            : expandedCollection.type === AP.CollectionTypes.COLLECTION) {
            return expandedCollection.items;
        }
    })();
    type_utilities_1.assert.isArray(expandedItems);
    const limitedItems = expandedItems.slice(firstItemIndex, firstItemIndex + ITEMS_PER_COLLECTION_PAGE);
    const items = [];
    for (const item of limitedItems) {
        if (item && !(item instanceof URL)) {
            if (type_utilities_1.guard.isTypeOf(item, AP.ActivityTypes) &&
                'object' in item &&
                item.object instanceof URL) {
                const object = await this.core.findEntityById(item.object);
                if (object) {
                    item.object = object;
                }
            }
            items.push(item);
        }
    }
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
exports.respond = respond;
//# sourceMappingURL=respond.js.map