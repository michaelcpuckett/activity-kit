"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
async function handleCreate() {
    if (!('object' in this.activity)) {
        throw new Error('Bad activity: no object.');
    }
    const object = this.activity.object;
    if (!object) {
        throw new Error('Bad object: not found.');
    }
    if (object instanceof URL) {
        throw new Error('Bad object: URL reference is not allowed for Create.');
    }
    if (Array.isArray(object)) {
        throw new Error('Internal error: Object array not supported currently. TODO.');
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
    if ((0, activitypub_core_utilities_1.isTypeOf)(object, activitypub_core_types_1.AP.CoreObjectTypes)) {
        const typedObject = object;
        typedObject.attributedTo = this.activity.actor;
        typedObject.replies = objectReplies.id;
        typedObject.likes = objectLikes.id;
        typedObject.shares = objectShares.id;
        typedObject.attributedTo = this.activity.actor;
        typedObject.published = publishedDate;
        await Promise.all([
            this.databaseService.saveEntity(object),
            this.databaseService.saveEntity(objectReplies),
            this.databaseService.saveEntity(objectLikes),
            this.databaseService.saveEntity(objectShares),
        ]);
        if (typedObject.inReplyTo) {
            const objectInReplyTo = await this.databaseService.findEntityById((0, activitypub_core_utilities_3.getId)(typedObject.inReplyTo));
            if (objectInReplyTo) {
                const repliesCollectionId = (0, activitypub_core_utilities_3.getId)(objectInReplyTo.replies);
                if (repliesCollectionId) {
                    await this.databaseService.insertOrderedItem(repliesCollectionId, typedObject.id);
                }
            }
        }
    }
    else {
        await Promise.all([this.databaseService.saveEntity(object)]);
    }
    this.activity.object = object;
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map