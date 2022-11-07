"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleCreate() {
    const activity = this.activity;
    if (!('object' in activity)) {
        throw new Error('Bad activity: no object.');
    }
    const object = activity.object;
    if ('inReplyTo' in object && object.inReplyTo) {
        const objectInReplyTo = await this.adapters.db.findEntityById((0, activitypub_core_utilities_1.getId)(object.inReplyTo));
        if (objectInReplyTo) {
            const repliesCollectionId = (0, activitypub_core_utilities_1.getId)(objectInReplyTo.replies);
            if (repliesCollectionId) {
                await this.adapters.db.insertOrderedItem(repliesCollectionId, object.id);
            }
        }
    }
    if ((0, activitypub_core_utilities_1.isType)(this.actor, activitypub_core_types_1.AP.ActorTypes.GROUP)) {
        const followingCollection = await this.adapters.db.findEntityById((0, activitypub_core_utilities_1.getId)(this.actor.following));
        if (!followingCollection) {
            throw new Error('Bad following collection: not found.');
        }
        if (!Array.isArray(followingCollection.items)) {
            throw new Error('Bad following collection: no items.');
        }
        if (!followingCollection.items.includes((0, activitypub_core_utilities_1.getId)(activity.actor))) {
            return;
        }
        const publishedDate = new Date();
        const announceActivityId = `${activitypub_core_utilities_1.LOCAL_DOMAIN}/entity/${(0, activitypub_core_utilities_1.getGuid)()}`;
        const announceActivityReplies = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: new URL(`${announceActivityId}/replies`),
            url: new URL(`${announceActivityId}/replies`),
            name: 'Replies',
            type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
            totalItems: 0,
            items: [],
            published: publishedDate,
        };
        const announceActivityLikes = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: new URL(`${announceActivityId}/likes`),
            url: new URL(`${announceActivityId}/likes`),
            name: 'Likes',
            type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
        };
        const announceActivityShares = {
            '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
            id: new URL(`${announceActivityId}/shares`),
            url: new URL(`${announceActivityId}/shares`),
            name: 'Likes',
            type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
            totalItems: 0,
            orderedItems: [],
            published: publishedDate,
        };
        const announceActivity = {
            id: new URL(announceActivityId),
            url: new URL(announceActivityId),
            type: activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE,
            actor: (0, activitypub_core_utilities_1.getId)(this.actor),
            object: (0, activitypub_core_utilities_1.getId)(object),
            replies: announceActivityReplies.id,
            likes: announceActivityLikes.id,
            shares: announceActivityShares.id,
            published: publishedDate,
        };
        await Promise.all([
            this.adapters.db.saveEntity(announceActivity),
            this.adapters.db.saveEntity(announceActivityReplies),
            this.adapters.db.saveEntity(announceActivityLikes),
            this.adapters.db.saveEntity(announceActivityShares),
            this.adapters.db.insertOrderedItem((0, activitypub_core_utilities_1.getId)(this.actor.outbox), announceActivityId),
        ]);
        await this.adapters.delivery.broadcast(announceActivity, this.actor);
    }
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map