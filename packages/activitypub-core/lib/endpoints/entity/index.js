"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityGetHandler = void 0;
const DatabaseService_1 = require("../../DatabaseService");
const src_1 = require("activitypub-core-types/src");
const globals_1 = require("../../globals");
const getTypedEntity_1 = require("../../utilities/getTypedEntity");
const convertUrlsToStrings_1 = require("../../utilities/convertUrlsToStrings");
const stringifyWithContext_1 = require("../../utilities/stringifyWithContext");
async function entityGetHandler(request, response, providedDatabaseService) {
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
    const url = new URL(`${globals_1.LOCAL_DOMAIN}${request.url}`);
    const databaseService = providedDatabaseService || (await DatabaseService_1.DatabaseService.connect());
    const foundEntity = await databaseService.findEntityById(url);
    if (!foundEntity) {
        return handleNotFound();
    }
    const typedEntity = (0, getTypedEntity_1.getTypedEntity)(foundEntity);
    if (!typedEntity) {
        return handleNotFound();
    }
    let entity = await databaseService.expandEntity(typedEntity);
    if (!entity) {
        return handleNotFound();
    }
    if (entity.type === src_1.AP.CollectionTypes.COLLECTION ||
        entity.type === src_1.AP.CollectionTypes.ORDERED_COLLECTION) {
        const collection = await databaseService.expandCollection(entity);
        if (collection) {
            entity = collection;
        }
    }
    if ('likes' in entity && entity.likes instanceof URL) {
        const foundLikesCollection = await databaseService.findEntityById(entity.likes);
        if (foundLikesCollection &&
            foundLikesCollection.type === src_1.AP.CollectionTypes.ORDERED_COLLECTION) {
            const expandedLikes = await databaseService.expandCollection(foundLikesCollection);
            if (expandedLikes &&
                expandedLikes.type === src_1.AP.CollectionTypes.ORDERED_COLLECTION) {
                entity.likes = expandedLikes;
            }
        }
    }
    if ('shares' in entity && entity.shares instanceof URL) {
        const foundSharesCollection = await databaseService.findEntityById(entity.shares);
        if (foundSharesCollection &&
            foundSharesCollection.type === src_1.AP.CollectionTypes.ORDERED_COLLECTION) {
            const expandedShares = await databaseService.expandCollection(foundSharesCollection);
            if (expandedShares &&
                expandedShares.type === src_1.AP.CollectionTypes.ORDERED_COLLECTION) {
                entity.shares = expandedShares;
            }
        }
    }
    if (request.headers.accept?.includes(globals_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
        request.headers.accept?.includes(globals_1.LINKED_DATA_CONTENT_TYPE) ||
        request.headers.accept?.includes(globals_1.JSON_CONTENT_TYPE)) {
        if (!entity) {
            return handleNotFound();
        }
        response.setHeader(globals_1.CONTENT_TYPE_HEADER, globals_1.ACTIVITYSTREAMS_CONTENT_TYPE);
        response.statusCode = 200;
        response.write((0, stringifyWithContext_1.stringifyWithContext)(entity));
        response.end();
        return {
            props: {},
        };
    }
    return {
        props: {
            entity: (0, convertUrlsToStrings_1.convertUrlsToStrings)(entity),
        },
    };
}
exports.entityGetHandler = entityGetHandler;
//# sourceMappingURL=index.js.map