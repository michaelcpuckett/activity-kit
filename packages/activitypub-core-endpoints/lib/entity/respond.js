"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const cookie_1 = __importDefault(require("cookie"));
const ITEMS_PER_COLLECTION_PAGE = 50;
async function respond(render) {
    const cookies = cookie_1.default.parse(this.req.headers.cookie ?? '');
    const authorizedActor = await this.layers.data.getActorByUserId(await this.layers.auth.getUserIdByToken(cookies.__session ?? ''));
    const urlParts = this.url.pathname.split('/');
    const pageParam = urlParts.pop();
    const hasPage = this.req.params['page'] === pageParam;
    if (hasPage) {
        urlParts.pop();
    }
    const pathname = hasPage ? urlParts.join('/') : this.url.pathname;
    const entity = await this.layers.data.findEntityById(new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${pathname}`));
    try {
        (0, activitypub_core_types_1.assertIsApEntity)(entity);
    }
    catch (error) {
        return this.handleNotFound();
    }
    this.res.setHeader('Vary', 'Accept');
    if (!(0, activitypub_core_utilities_1.isTypeOf)(entity, activitypub_core_types_1.AP.CollectionTypes) &&
        !(0, activitypub_core_utilities_1.isTypeOf)(entity, activitypub_core_types_1.AP.CollectionPageTypes)) {
        return await this.handleFoundEntity(render, entity, authorizedActor);
    }
    (0, activitypub_core_types_1.assertIsApCollection)(entity);
    const isOrderedCollection = (0, activitypub_core_utilities_1.isType)(entity, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    const totalItems = Number(entity.totalItems);
    const lastPageIndex = Math.max(1, Math.ceil(totalItems / ITEMS_PER_COLLECTION_PAGE));
    const currentPage = Number(pageParam) || 1;
    const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE;
    const startIndex = firstItemIndex + 1;
    const baseUrl = new URL(pathname, new URL(activitypub_core_utilities_1.LOCAL_DOMAIN));
    const getPageUrl = (page) => new URL(`${pathname === '/' ? '' : pathname}/page/${page}`, new URL(activitypub_core_utilities_1.LOCAL_DOMAIN));
    if (!hasPage) {
        (0, activitypub_core_types_1.assertIsApCollection)(entity);
        delete entity.orderedItems;
        delete entity.items;
        const collectionEntity = {
            ...entity,
            first: getPageUrl(1),
            last: getPageUrl(lastPageIndex),
        };
        return await this.handleFoundEntity(render, collectionEntity, authorizedActor);
    }
    const expandedCollection = await this.layers.data.expandCollection(entity);
    const expandedItems = (() => {
        if ((0, activitypub_core_utilities_1.isType)(expandedCollection, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
            (0, activitypub_core_types_1.assertIsApType)(expandedCollection, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION);
            return expandedCollection.orderedItems;
        }
        if ((0, activitypub_core_utilities_1.isType)(expandedCollection, activitypub_core_types_1.AP.CollectionTypes.COLLECTION)) {
            (0, activitypub_core_types_1.assertIsApType)(expandedCollection, activitypub_core_types_1.AP.CollectionTypes.COLLECTION);
            return expandedCollection.items;
        }
    })();
    (0, activitypub_core_types_1.assertIsArray)(expandedItems);
    const limitedItems = expandedItems.slice(firstItemIndex, firstItemIndex + ITEMS_PER_COLLECTION_PAGE);
    const items = [];
    for (const item of limitedItems) {
        if (item && !(item instanceof URL)) {
            if ((0, activitypub_core_utilities_1.isTypeOf)(item, activitypub_core_types_1.AP.ActivityTypes) &&
                'object' in item &&
                item.object instanceof URL) {
                const object = await this.layers.data.findEntityById(item.object);
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
            type: activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
            orderedItems: items,
            startIndex,
        };
        return await this.handleFoundEntity(render, orderedCollectionPageEntity, authorizedActor);
    }
    const collectionPageEntity = {
        ...collectionPage,
        type: activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE,
        items: items,
    };
    return await this.handleFoundEntity(render, collectionPageEntity, authorizedActor);
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map