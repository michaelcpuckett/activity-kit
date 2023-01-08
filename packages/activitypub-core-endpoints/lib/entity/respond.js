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
    const authorizedActor = await this.adapters.db.getActorByUserId(await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''));
    const entity = await this.adapters.db.findEntityById(new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}`));
    try {
        (0, activitypub_core_types_1.assertIsApEntity)(entity);
    }
    catch (error) {
        return this.handleNotFound();
    }
    this.res.setHeader('Vary', 'Accept');
    if (!(0, activitypub_core_utilities_1.isTypeOf)(entity, activitypub_core_types_1.AP.CollectionTypes) && !(0, activitypub_core_utilities_1.isTypeOf)(entity, activitypub_core_types_1.AP.CollectionPageTypes)) {
        return await this.handleFoundEntity(render, entity, authorizedActor);
    }
    const isOrderedCollection = (0, activitypub_core_utilities_1.isType)(entity, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    const query = this.url.searchParams;
    const page = query.get('page');
    const current = query.has('current');
    const sort = query.get('sort');
    const limit = query.has('limit') ? Number(query.get('limit')) : ITEMS_PER_COLLECTION_PAGE;
    const entityItems = isOrderedCollection ? entity.orderedItems : entity.items;
    (0, activitypub_core_types_1.assertIsArray)(entityItems);
    const lastPageIndex = Math.max(1, Math.ceil(entityItems.length / limit));
    const currentPage = Number(page) || 1;
    const firstItemIndex = (currentPage - 1) * limit;
    const startIndex = firstItemIndex + 1;
    if (!page) {
        try {
            (0, activitypub_core_types_1.assertIsApType)(entity, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION);
            delete entity.orderedItems;
        }
        catch (error) {
            (0, activitypub_core_types_1.assertIsApType)(entity, activitypub_core_types_1.AP.CollectionTypes.COLLECTION);
            delete entity.items;
        }
        const collectionEntity = {
            ...entity,
            first: new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?page=1${current ? '&current' : ''}${sort ? `&sort=${sort}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`),
            last: new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?page=${lastPageIndex}${current ? '&current' : ''}${sort ? `&sort=${sort}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`),
            current: new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?current`),
            totalItems: entityItems.length,
        };
        return await this.handleFoundEntity(render, collectionEntity, authorizedActor);
    }
    const expandedItems = await Promise.all(entityItems.map(async (entity) => {
        const id = (0, activitypub_core_utilities_1.getId)(entity);
        return await this.adapters.db.findEntityById(id);
    }));
    const sortedItems = sort ? expandedItems.sort((a, b) => {
        const aField = a && sort in a && a[sort];
        const bField = b && sort in b && b[sort];
        try {
            (0, activitypub_core_types_1.assertIsString)(aField);
            (0, activitypub_core_types_1.assertIsString)(bField);
            if (aField.toLowerCase() > bField.toLowerCase()) {
                return current ? -1 : 1;
            }
            else {
                return current ? 1 : -1;
            }
        }
        catch (error) {
            try {
                (0, activitypub_core_types_1.assertIsDate)(aField);
                (0, activitypub_core_types_1.assertIsDate)(bField);
                if (aField.valueOf() > bField.valueOf()) {
                    return current ? -1 : 1;
                }
                else {
                    return current ? 1 : -1;
                }
            }
            catch (error) {
                try {
                    (0, activitypub_core_types_1.assertIsNumber)(aField);
                    (0, activitypub_core_types_1.assertIsNumber)(bField);
                    if (aField > bField) {
                        return current ? -1 : 1;
                    }
                    else {
                        return current ? 1 : -1;
                    }
                }
                catch (error) {
                    return current ? 1 : -1;
                }
            }
        }
    }) : expandedItems;
    const limitedItems = sortedItems.slice(firstItemIndex, firstItemIndex + limit);
    const items = [];
    for (const item of limitedItems) {
        if (item) {
            if ((0, activitypub_core_utilities_1.isTypeOf)(item, activitypub_core_types_1.AP.ActivityTypes) && 'object' in item && item.object instanceof URL) {
                const object = await this.adapters.db.findEntityById(item.object);
                if (object) {
                    item.object = object;
                }
            }
            items.push(item);
        }
    }
    const baseUrl = `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}`;
    const urlEnding = `${current ? '&current' : ''}${query.has('limit') ? `&limit=${limit}` : ''}${sort ? `&sort=${sort}` : ''}`;
    const collectionPageEntity = {
        ...entity,
        type: isOrderedCollection ? activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE : activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE,
        id: new URL(`${baseUrl}?page=${currentPage}${urlEnding}`),
        url: new URL(`${baseUrl}?page=${currentPage}${urlEnding}`),
        partOf: new URL(`${baseUrl}${current ? '?current' : ''}`),
        first: new URL(`${baseUrl}?page=1${urlEnding}`),
        last: new URL(`${baseUrl}?page=${lastPageIndex}${urlEnding}`),
        current: new URL(`${baseUrl}?current`),
        ...(currentPage > 1) ? {
            prev: new URL(`${baseUrl}?page=${currentPage - 1}${urlEnding}`),
        } : null,
        ...(currentPage < lastPageIndex) ? {
            next: new URL(`${baseUrl}?page=${currentPage + 1}${urlEnding}`),
        } : null,
        [isOrderedCollection ? 'orderedItems' : 'items']: items,
        ...isOrderedCollection ? {
            startIndex,
        } : null,
        totalItems: entityItems.length,
    };
    return await this.handleFoundEntity(render, collectionPageEntity, authorizedActor);
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map