"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
async function handleCreate(activity, databaseService) {
    if (!activity.object ||
        activity.object instanceof URL ||
        Array.isArray(activity.object)) {
        throw new Error('bad request 1');
    }
    const object = (0, activitypub_core_utilities_1.getTypedEntity)(activity.object);
    if (!object) {
        throw new Error('Bad request. 2');
    }
    const objectId = `${activitypub_core_utilities_2.LOCAL_DOMAIN}/object/${(0, activitypub_core_utilities_3.getGuid)()}`;
    object.id = new URL(objectId);
    if ('url' in object) {
        object.url = new URL(objectId);
    }
    const publishedDate = new Date();
    const objectReplies = {
        "@context": new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${object.id.toString()}/replies`),
        url: new URL(`${object.id.toString()}/replies`),
        name: 'Replies',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        published: publishedDate,
    };
    const objectLikes = {
        "@context": new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${object.id.toString()}/likes`),
        url: new URL(`${object.id.toString()}/likes`),
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const objectShares = {
        "@context": new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${object.id.toString()}/shares`),
        url: new URL(`${object.id.toString()}/shares`),
        name: 'Shares',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    if (!('id' in object) || !object.id) {
        throw new Error('Bad request 4');
    }
    for (const type of Object.values(activitypub_core_types_1.AP.CoreObjectTypes)) {
        if (type === object.type) {
            object.attributedTo = activity.actor;
            object.replies = objectReplies;
            object.likes = objectLikes;
            object.shares = objectShares;
            object.published = new Date();
            object.attributedTo = activity.actor;
            object.published = publishedDate;
            await Promise.all([
                databaseService.saveEntity(object),
                databaseService.saveEntity(objectReplies),
                databaseService.saveEntity(objectLikes),
                databaseService.saveEntity(objectShares),
            ]);
            return object.id;
        }
    }
    await Promise.all([databaseService.saveEntity(object)]);
    return object.id;
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map