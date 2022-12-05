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
        const followersCollection = await this.adapters.db.findEntityById((0, activitypub_core_utilities_1.getId)(this.actor.followers));
        if (!followersCollection) {
            throw new Error('Bad following collection: not found.');
        }
        if (!Array.isArray(followersCollection.items)) {
            throw new Error('Bad following collection: no items.');
        }
        if (!followersCollection.items.map(id => id.toString()).includes((0, activitypub_core_utilities_1.getId)(activity.actor).toString())) {
            return;
        }
        const publishedDate = new Date();
        const announceActivityId = `${activitypub_core_utilities_1.LOCAL_DOMAIN}/entity/${(0, activitypub_core_utilities_1.getGuid)()}`;
        if (!('streams' in this.actor) ||
            !this.actor.streams ||
            !Array.isArray(this.actor.streams)) {
            throw new Error("Actor's streams not found.");
        }
        const streams = await Promise.all(this.actor.streams
            .map((stream) => stream instanceof URL ? stream : stream.id)
            .map(async (id) => id ? await this.adapters.db.findEntityById(id) : null));
        const shared = streams.find((stream) => {
            if (stream && 'name' in stream) {
                if (stream.name === 'Shared') {
                    return true;
                }
            }
        });
        if (!shared || !shared.id) {
            throw new Error('Bad shared collection: not found.');
        }
        const objectToAnnounce = await (async () => {
            if (!('inReplyTo' in object && object.inReplyTo)) {
                return object;
            }
            const objectInReplyToId = (0, activitypub_core_utilities_1.getId)(object.inReplyTo);
            if (shared.orderedItems.map(orderedItem => (0, activitypub_core_utilities_1.getId)(orderedItem).toString()).includes(objectInReplyToId.toString())) {
                return object;
            }
            const objectInReplyTo = await this.adapters.db.queryById(objectInReplyToId);
            if (!objectInReplyTo) {
                return object;
            }
            return objectInReplyTo;
        })();
        this.activity.object = objectToAnnounce;
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
            name: 'Shares',
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
            to: [new URL(activitypub_core_utilities_1.PUBLIC_ACTOR), (0, activitypub_core_utilities_1.getId)(this.actor.followers)],
            object: (0, activitypub_core_utilities_1.getId)(objectToAnnounce),
            context: (0, activitypub_core_utilities_1.getId)(object),
            replies: announceActivityReplies.id,
            likes: announceActivityLikes.id,
            shares: announceActivityShares.id,
            published: publishedDate,
        };
        await Promise.all([this.adapters.db.insertOrderedItem(shared.id, announceActivity.id)]);
        const isLocal = (0, activitypub_core_utilities_1.getCollectionNameByUrl)((0, activitypub_core_utilities_1.getId)(objectToAnnounce)) !== 'foreign-entity';
        if (isLocal) {
            if (!('shares' in objectToAnnounce) || !objectToAnnounce.shares) {
                throw new Error('Object is local, but `shares` is not in this object.');
            }
            const sharesId = (0, activitypub_core_utilities_1.getId)(objectToAnnounce.shares);
            if (!sharesId) {
                throw new Error('Bad shares collection: no ID.');
            }
            await Promise.all([
                this.adapters.db.insertOrderedItem(sharesId, announceActivityId),
            ]);
        }
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