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
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${object.id.toString()}/replies`),
        url: new URL(`${object.id.toString()}/replies`),
        name: 'Replies',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        published: publishedDate,
    };
    const objectLikes = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${object.id.toString()}/likes`),
        url: new URL(`${object.id.toString()}/likes`),
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const objectShares = {
        '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${object.id.toString()}/shares`),
        url: new URL(`${object.id.toString()}/shares`),
        name: 'Shares',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    if (!('id' in object) || !object.id || !('type' in object) || !object.type) {
        throw new Error('Bad request 4');
    }
    for (const type of Object.values(activitypub_core_types_1.AP.CoreObjectTypes)) {
        const typedObject = (0, activitypub_core_utilities_1.getTypedEntity)(object);
        if (Array.isArray(typedObject.type) ? typedObject.type.includes(type) : type === typedObject.type) {
            typedObject.attributedTo = activity.actor;
            typedObject.replies = objectReplies;
            typedObject.likes = objectLikes;
            typedObject.shares = objectShares;
            typedObject.published = new Date();
            typedObject.attributedTo = activity.actor;
            typedObject.published = publishedDate;
            await Promise.all([
                databaseService.saveEntity(typedObject),
                databaseService.saveEntity(objectReplies),
                databaseService.saveEntity(objectLikes),
                databaseService.saveEntity(objectShares),
            ]);
            if (typedObject.inReplyTo) {
                const objectInReplyTo = await databaseService.findEntityById((0, activitypub_core_utilities_3.getId)(typedObject.inReplyTo));
                if (objectInReplyTo) {
                    const repliesCollectionId = (0, activitypub_core_utilities_3.getId)(objectInReplyTo.replies);
                    if (repliesCollectionId) {
                        await databaseService.insertOrderedItem(repliesCollectionId, typedObject.id);
                    }
                }
            }
            return object.id;
        }
    }
    await Promise.all([databaseService.saveEntity(object)]);
    return object.id;
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map