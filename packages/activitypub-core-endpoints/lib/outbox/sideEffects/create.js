"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
async function handleCreate(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.CREATE);
    const actorId = (0, activitypub_core_utilities_3.getId)(activity.actor);
    (0, activitypub_core_types_1.assertExists)(actorId);
    const object = activity.object;
    if (object instanceof URL) {
        throw new Error('Bad object: URL reference is not allowed for Create.');
    }
    if (Array.isArray(object)) {
        throw new Error('Internal error: Object array not supported currently. TODO.');
    }
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    const objectId = `${activitypub_core_utilities_2.LOCAL_DOMAIN}/entity/${(0, activitypub_core_utilities_3.getGuid)()}`;
    object.id = new URL(objectId);
    if ((0, activitypub_core_utilities_1.isTypeOf)(object, activitypub_core_types_1.AP.ExtendedObjectTypes)) {
        (0, activitypub_core_types_1.assertIsApExtendedObject)(object);
        object.url = new URL(objectId);
        const publishedDate = new Date();
        const objectRepliesId = new URL(`${objectId.toString()}/replies`);
        const objectReplies = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: objectRepliesId,
            url: objectRepliesId,
            name: 'Replies',
            type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
            totalItems: 0,
            items: [],
            published: publishedDate,
        };
        const objectLikesId = new URL(`${objectId.toString()}/likes`);
        const objectLikes = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: objectLikesId,
            url: objectLikesId,
            name: 'Likes',
            type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
        };
        const objectSharesId = new URL(`${objectId.toString()}/shares`);
        const objectShares = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: objectSharesId,
            url: objectSharesId,
            name: 'Shares',
            type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
        };
        object.attributedTo = actorId;
        object.replies = objectRepliesId;
        object.likes = objectLikesId;
        object.shares = objectSharesId;
        object.published = publishedDate;
        await Promise.all([
            this.adapters.db.saveEntity(object),
            this.adapters.db.saveEntity(objectReplies),
            this.adapters.db.saveEntity(objectLikes),
            this.adapters.db.saveEntity(objectShares),
        ]);
        if (object.inReplyTo) {
            const objectInReplyTo = await this.adapters.db.findEntityById((0, activitypub_core_utilities_3.getId)(object.inReplyTo));
            if (objectInReplyTo) {
                const repliesCollectionId = (0, activitypub_core_utilities_3.getId)(objectInReplyTo.replies);
                if (repliesCollectionId) {
                    await this.adapters.db.insertOrderedItem(repliesCollectionId, objectId);
                }
            }
        }
    }
    else {
        await this.adapters.db.saveEntity(object);
    }
    activity.object = object;
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map