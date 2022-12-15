"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFollow = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const activitypub_core_utilities_4 = require("activitypub-core-utilities");
async function handleFollow() {
    const activity = this.activity;
    if (!('object' in activity)) {
        throw new Error('Bad activity: no object.');
    }
    const objectId = (0, activitypub_core_utilities_4.getId)(activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.adapters.db.queryById(objectId);
    if (!object) {
        throw new Error('Bad object: not found.');
    }
    if (!(0, activitypub_core_utilities_1.isTypeOf)(object, activitypub_core_types_1.AP.ActorTypes)) {
        return;
    }
    if (!('actor' in activity)) {
        throw new Error('Bad activity: no actor.');
    }
    const actorId = (0, activitypub_core_utilities_4.getId)(activity.actor);
    if (!actorId) {
        throw new Error('Bad activity: No actor.');
    }
    const actor = await this.adapters.db.queryById(actorId);
    if (!actor) {
        throw new Error('Bad actor: Not found.');
    }
    if (!(0, activitypub_core_utilities_1.isTypeOf)(actor, activitypub_core_types_1.AP.ActorTypes)) {
        throw new Error('Bad actor: Type not recognized as an actor.');
    }
    const follower = actor;
    const followee = object;
    if (!(follower.id && followee.id)) {
        return;
    }
    const followersId = (0, activitypub_core_utilities_4.getId)(followee.followers);
    if (!followersId) {
        throw new Error('Bad followee: No followers ID.');
    }
    const followers = await this.adapters.db.findEntityById(followersId);
    if (!followers) {
        throw new Error('Bad followers collection: Not found.');
    }
    if (followers.items.map((id) => id.toString()).includes((0, activitypub_core_utilities_4.getId)(follower).toString())) {
        console.log('NOTE: ALREADY A FOLLOWER.');
        return;
    }
    if (this.actor.manuallyApprovesFollowers) {
        const streams = await Promise.all(this.actor.streams.map(async (stream) => await this.adapters.db.fetchEntityById(stream)));
        const requests = streams.find((stream) => {
            if (stream.name === 'Requests') {
                return true;
            }
        });
        if (!requests) {
            throw new Error('Bad Requests cllection: Not found.');
        }
        await this.adapters.db.insertItem((0, activitypub_core_utilities_4.getId)(requests), activity.id);
        return;
    }
    const acceptActivityId = `${activitypub_core_utilities_3.LOCAL_DOMAIN}/entity/${(0, activitypub_core_utilities_2.getGuid)()}`;
    const publishedDate = new Date();
    const acceptActivityReplies = {
        '@context': new URL(activitypub_core_utilities_3.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${acceptActivityId}/replies`),
        url: new URL(`${acceptActivityId}/replies`),
        name: 'Replies',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        published: publishedDate,
    };
    const acceptActivityLikes = {
        '@context': new URL(activitypub_core_utilities_3.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${acceptActivityId}/likes`),
        url: new URL(`${acceptActivityId}/likes`),
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const acceptActivityShares = {
        '@context': new URL(activitypub_core_utilities_3.ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${acceptActivityId}/shares`),
        url: new URL(`${acceptActivityId}/shares`),
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const acceptActivity = {
        '@context': activitypub_core_utilities_3.ACTIVITYSTREAMS_CONTEXT,
        id: new URL(acceptActivityId),
        url: new URL(acceptActivityId),
        type: activitypub_core_types_1.AP.ActivityTypes.ACCEPT,
        to: [new URL(activitypub_core_utilities_3.PUBLIC_ACTOR), follower.id],
        actor: followee.id,
        object: activity.id,
        replies: acceptActivityReplies.id,
        likes: acceptActivityLikes.id,
        shares: acceptActivityShares.id,
        published: publishedDate,
    };
    const followeeOutboxId = (0, activitypub_core_utilities_4.getId)(followee.outbox);
    if (!followeeOutboxId) {
        throw new Error('Bad followee: No outbox ID.');
    }
    await Promise.all([
        this.adapters.db.saveEntity(acceptActivity),
        this.adapters.db.saveEntity(acceptActivityReplies),
        this.adapters.db.saveEntity(acceptActivityLikes),
        this.adapters.db.saveEntity(acceptActivityShares),
        this.adapters.db.insertOrderedItem(followeeOutboxId, acceptActivity.id),
        this.adapters.db.insertItem(followersId, follower.id),
    ]);
    await this.adapters.delivery.broadcast(acceptActivity, followee);
}
exports.handleFollow = handleFollow;
//# sourceMappingURL=follow.js.map