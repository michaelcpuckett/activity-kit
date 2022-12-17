"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGetEndpoint = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const cookie_1 = __importDefault(require("cookie"));
const ITEMS_PER_COLLECTION_PAGE = 50;
class EntityGetEndpoint {
    req;
    res;
    adapters;
    plugins;
    url;
    constructor(req, res, adapters, plugins, url) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
        this.url = url ?? new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${req.url}`);
    }
    handleBadRequest() {
        this.res.statusCode = 500;
        this.res.write('Bad request');
        this.res.end();
        return {
            props: {},
        };
    }
    handleNotFound() {
        this.res.statusCode = 400;
        this.res.write('Not found');
        this.res.end();
        return {
            props: {},
        };
    }
    async respond(render) {
        const cookies = cookie_1.default.parse(this.req.headers.cookie ?? '');
        const authorizedActor = await this.adapters.db.getActorByUserId(await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''));
        const entity = await this.adapters.db.findEntityById(new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}`));
        if (!entity) {
            return this.handleNotFound();
        }
        if ('publicKey' in entity && entity.publicKey) {
            entity.publicKey = entity.publicKey;
        }
        this.res.setHeader('Vary', 'Accept');
        this.res.statusCode = 200;
        if (this.req.headers.accept?.includes(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.LINKED_DATA_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.JSON_CONTENT_TYPE)) {
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
            if (!(0, activitypub_core_utilities_1.isTypeOf)(entity, activitypub_core_types_1.AP.CollectionTypes) && !(0, activitypub_core_utilities_1.isTypeOf)(entity, activitypub_core_types_1.AP.CollectionPageTypes)) {
                this.res.write((0, activitypub_core_utilities_3.stringify)(entity));
                this.res.end();
                return;
            }
            const isOrderedCollection = (0, activitypub_core_utilities_1.isType)(entity, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION);
            const lagePageIndex = Math.max(1, Math.ceil(Number(entity.totalItems) / ITEMS_PER_COLLECTION_PAGE));
            const query = this.url.searchParams;
            const page = query.get('page');
            const current = query.has('current');
            if (!page) {
                this.res.write((0, activitypub_core_utilities_3.stringify)({
                    ...entity,
                    first: `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?page=1${current ? '&current' : ''}`,
                    last: `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?page=${lagePageIndex}${current ? '&current' : ''}`,
                    current: `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?current`,
                }));
                if (isOrderedCollection) {
                    delete entity.orderedItems;
                }
                else {
                    delete entity.items;
                }
                this.res.end();
                return;
            }
            const currentPage = Number(page);
            const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE + 1;
            if (!currentPage) {
                throw new Error('Bad query string value: not a number.');
            }
            const expandedItems = await Promise.all(entity[isOrderedCollection ? 'orderedItems' : 'items'].slice(firstItemIndex, firstItemIndex + ITEMS_PER_COLLECTION_PAGE)[current ? 'reverse' : 'slice']().map(async (id) => {
                return await this.adapters.db.queryById(id);
            }));
            const items = [];
            for (const item of expandedItems) {
                if (item) {
                    if (item instanceof URL) {
                        items.push(item);
                    }
                    else {
                        if ((0, activitypub_core_utilities_1.isTypeOf)(item, activitypub_core_types_1.AP.ActivityTypes) && 'object' in item && item.object instanceof URL) {
                            const object = await this.adapters.db.findEntityById(item.object);
                            if (object) {
                                item.object = object;
                            }
                        }
                        items.push(item);
                    }
                }
            }
            this.res.write((0, activitypub_core_utilities_3.stringify)({
                ...entity,
                type: isOrderedCollection ? activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE : activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE,
                [isOrderedCollection ? 'orderedItems' : 'items']: items,
                ...isOrderedCollection ? {
                    startIndex: firstItemIndex,
                } : null,
                partOf: `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}${current ? '&current' : ''}`,
                ...(currentPage > 1) ? {
                    prev: `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?page=${currentPage - 1}${current ? '&current' : ''}`
                } : null,
                ...(currentPage < lagePageIndex) ? {
                    next: `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?page=${currentPage + 1}${current ? '&current' : ''}`
                } : null,
                first: `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?page=1${current ? '&current' : ''}`,
                last: `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?page=${lagePageIndex}${current ? '&current' : ''}`,
                current: `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.url.pathname}?current`,
            }));
            this.res.end();
            return;
        }
        else {
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            let props = {
                entity,
                actor: authorizedActor,
            };
            if (this.plugins) {
                for (const plugin of this.plugins) {
                    if ('getHomePageProps' in plugin && plugin.getHomePageProps) {
                        props = {
                            ...props,
                            ...(await plugin.getEntityPageProps(entity)),
                        };
                    }
                }
            }
            const formattedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => {
                if (typeof value === 'object') {
                    return [key, (0, activitypub_core_utilities_2.convertUrlsToStrings)(value)];
                }
                else {
                    return [key, value];
                }
            }));
            this.res.write(await render(formattedProps));
            this.res.end();
        }
    }
}
exports.EntityGetEndpoint = EntityGetEndpoint;
//# sourceMappingURL=index.js.map