"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const types_1 = require("@activity-kit/types");
const types_2 = require("@activity-kit/types");
const ITEMS_PER_COLLECTION_PAGE = 50;
async function respond(render) {
    const hasPage = this.url.href.includes('/page/');
    const pageParts = this.url.href.split('/page/');
    const baseUrl = hasPage ? new URL(pageParts[0]) : this.url;
    const entity = await this.core.findEntityById(baseUrl);
    try {
        (0, types_1.assertIsApEntity)(entity);
    }
    catch (error) {
        return this.handleNotFound();
    }
    if (!(0, types_2.isTypeOf)(entity, types_1.AP.CollectionTypes) &&
        !(0, types_2.isTypeOf)(entity, types_1.AP.CollectionPageTypes)) {
        return this.handleNotFound();
    }
    (0, types_1.assertIsApCollection)(entity);
    const totalItems = Number(entity.totalItems);
    const lastPageIndex = Math.max(1, Math.ceil(totalItems / ITEMS_PER_COLLECTION_PAGE));
    const isOrderedCollection = (0, types_2.isType)(entity, types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    const getPageUrl = (page) => new URL(`${this.url.pathname === '/' ? '' : this.url.pathname}/page/${page}`, this.url.origin);
    const page = pageParts[1];
    const currentPage = page ? Number(page) : 1;
    const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE;
    const startIndex = firstItemIndex + 1;
    if (!hasPage) {
        (0, types_1.assertIsApCollection)(entity);
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
            ? expandedCollection.type.includes(types_1.AP.CollectionTypes.ORDERED_COLLECTION)
            : expandedCollection.type === types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
            return expandedCollection.orderedItems;
        }
        if (Array.isArray(expandedCollection.type)
            ? expandedCollection.type.includes(types_1.AP.CollectionTypes.COLLECTION)
            : expandedCollection.type === types_1.AP.CollectionTypes.COLLECTION) {
            return expandedCollection.items;
        }
    })();
    (0, types_1.assertIsArray)(expandedItems);
    const limitedItems = expandedItems.slice(firstItemIndex, firstItemIndex + ITEMS_PER_COLLECTION_PAGE);
    const items = [];
    for (const item of limitedItems) {
        if (item && !(item instanceof URL)) {
            if ((0, types_2.isTypeOf)(item, types_1.AP.ActivityTypes) &&
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
            type: types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
            orderedItems: items,
            startIndex,
        };
        return this.handleFoundEntity(orderedCollectionPageEntity, render);
    }
    const collectionPageEntity = {
        ...collectionPage,
        type: types_1.AP.CollectionPageTypes.COLLECTION_PAGE,
        items: items,
    };
    return this.handleFoundEntity(collectionPageEntity, render);
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map