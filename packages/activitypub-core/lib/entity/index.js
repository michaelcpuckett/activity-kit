"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityGetHandler = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const activitypub_core_utilities_4 = require("activitypub-core-utilities");
const cookie_1 = __importDefault(require("cookie"));
async function entityGetHandler(request, response, serviceAccount, databaseService) {
    if (!response) {
        throw new Error('Bad request.');
    }
    const handleBadRequest = () => {
        response.statusCode = 500;
        response.write('Bad request');
        response.end();
        return {
            props: {},
        };
    };
    const handleNotFound = () => {
        response.statusCode = 400;
        response.write('Not found');
        response.end();
        return {
            props: {},
        };
    };
    if (!request) {
        return handleBadRequest();
    }
    const cookies = cookie_1.default.parse(request.headers.cookie ?? '');
    const actor = await databaseService.getActorByToken(cookies.__session ?? '', serviceAccount);
    const url = new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${request.url}`);
    const foundEntity = await databaseService.findEntityById(url);
    if (!foundEntity) {
        return handleNotFound();
    }
    const typedEntity = (0, activitypub_core_utilities_2.getTypedEntity)(foundEntity);
    if (!typedEntity) {
        return handleNotFound();
    }
    let entity = await databaseService.expandEntity(typedEntity);
    if (!entity) {
        return handleNotFound();
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION ||
        entity.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
        const collection = await databaseService.expandCollection(entity);
        if (collection) {
            entity = collection;
        }
    }
    if ('likes' in entity && entity.likes instanceof URL) {
        const foundLikesCollection = await databaseService.findEntityById(entity.likes);
        if (foundLikesCollection &&
            foundLikesCollection.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
            const expandedLikes = await databaseService.expandCollection(foundLikesCollection);
            if (expandedLikes &&
                expandedLikes.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
                entity.likes = expandedLikes;
            }
        }
    }
    if ('shares' in entity && entity.shares instanceof URL) {
        const foundSharesCollection = await databaseService.findEntityById(entity.shares);
        if (foundSharesCollection &&
            foundSharesCollection.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
            const expandedShares = await databaseService.expandCollection(foundSharesCollection);
            if (expandedShares &&
                expandedShares.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
                entity.shares = expandedShares;
            }
        }
    }
    if (request.headers.accept?.includes(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
        request.headers.accept?.includes(activitypub_core_utilities_1.LINKED_DATA_CONTENT_TYPE) ||
        request.headers.accept?.includes(activitypub_core_utilities_1.JSON_CONTENT_TYPE)) {
        if (!entity) {
            return handleNotFound();
        }
        response.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
        response.statusCode = 200;
        response.write((0, activitypub_core_utilities_4.stringifyWithContext)(entity));
        response.end();
        return {
            props: {},
        };
    }
    return {
        props: {
            entity: (0, activitypub_core_utilities_3.convertUrlsToStrings)(entity),
            actor: (0, activitypub_core_utilities_3.convertUrlsToStrings)(actor),
        },
    };
}
exports.entityGetHandler = entityGetHandler;
//# sourceMappingURL=index.js.map