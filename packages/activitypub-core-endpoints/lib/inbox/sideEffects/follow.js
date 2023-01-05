"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFollow = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const activitypub_core_utilities_4 = require("activitypub-core-utilities");
async function handleFollow(activity, recipient) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.FOLLOW);
    const activityId = (0, activitypub_core_utilities_4.getId)(activity);
    (0, activitypub_core_types_1.assertExists)(activityId);
    const objectId = (0, activitypub_core_utilities_4.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const object = await this.adapters.db.queryById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    if (!(0, activitypub_core_utilities_1.isTypeOf)(object, activitypub_core_types_1.AP.ActorTypes)) {
        return;
    }
    (0, activitypub_core_types_1.assertIsApActor)(object);
    const actorId = (0, activitypub_core_utilities_4.getId)(activity.actor);
    (0, activitypub_core_types_1.assertExists)(actorId);
    const actor = await this.adapters.db.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const follower = actor;
    const followerId = (0, activitypub_core_utilities_4.getId)(follower);
    (0, activitypub_core_types_1.assertExists)(followerId);
    const followee = object;
    const followeeId = (0, activitypub_core_utilities_4.getId)(followee);
    (0, activitypub_core_types_1.assertExists)(followeeId);
    if (followeeId.toString() !== (0, activitypub_core_utilities_4.getId)(recipient)?.toString()) {
        return;
    }
    const followersId = (0, activitypub_core_utilities_4.getId)(followee.followers);
    (0, activitypub_core_types_1.assertExists)(followersId);
    const followers = await this.adapters.db.findEntityById(followersId);
    (0, activitypub_core_types_1.assertIsApType)(followers, activitypub_core_types_1.AP.CollectionTypes.COLLECTION);
    (0, activitypub_core_types_1.assertIsArray)(followers.items);
    if (followers.items
        .map((id) => id?.toString())
        .includes(followerId.toString())) {
        console.log('Already a follower.');
        return;
    }
    if (followee.manuallyApprovesFollowers) {
        const requests = await this.adapters.db.getStreamByName(followee, 'Requests');
        (0, activitypub_core_types_1.assertIsApType)(requests, activitypub_core_types_1.AP.CollectionTypes.COLLECTION);
        const requestsId = (0, activitypub_core_utilities_4.getId)(requests);
        await this.adapters.db.insertItem(requestsId, activityId);
        return;
    }
    const acceptActivityId = `${activitypub_core_utilities_3.LOCAL_DOMAIN}/entity/${(0, activitypub_core_utilities_2.getGuid)()}`;
    const publishedDate = new Date();
    const acceptActivityRepliesId = new URL(`${acceptActivityId}/replies`);
    const acceptActivityReplies = {
        '@context': new URL(activitypub_core_utilities_3.ACTIVITYSTREAMS_CONTEXT),
        id: acceptActivityRepliesId,
        url: acceptActivityRepliesId,
        name: 'Replies',
        type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
        attributedTo: followeeId,
        totalItems: 0,
        items: [],
        published: publishedDate,
    };
    const acceptActivityLikesId = new URL(`${acceptActivityId}/likes`);
    const acceptActivityLikes = {
        '@context': new URL(activitypub_core_utilities_3.ACTIVITYSTREAMS_CONTEXT),
        id: acceptActivityLikesId,
        url: acceptActivityLikesId,
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: followeeId,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const acceptActivitySharesId = new URL(`${acceptActivityId}/shares`);
    const acceptActivityShares = {
        '@context': new URL(activitypub_core_utilities_3.ACTIVITYSTREAMS_CONTEXT),
        id: acceptActivitySharesId,
        url: acceptActivitySharesId,
        name: 'Likes',
        type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: followeeId,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
    };
    const acceptActivity = {
        '@context': activitypub_core_utilities_3.ACTIVITYSTREAMS_CONTEXT,
        id: new URL(acceptActivityId),
        url: new URL(acceptActivityId),
        type: activitypub_core_types_1.AP.ActivityTypes.ACCEPT,
        to: [new URL(activitypub_core_utilities_3.PUBLIC_ACTOR), followerId],
        actor: followeeId,
        object: activityId,
        replies: acceptActivityRepliesId,
        likes: acceptActivityLikesId,
        shares: acceptActivitySharesId,
        published: publishedDate,
    };
    const followeeOutboxId = (0, activitypub_core_utilities_4.getId)(followee.outbox);
    (0, activitypub_core_types_1.assertExists)(followeeOutboxId);
    await Promise.all([
        this.adapters.db.saveEntity(acceptActivity),
        this.adapters.db.saveEntity(acceptActivityReplies),
        this.adapters.db.saveEntity(acceptActivityLikes),
        this.adapters.db.saveEntity(acceptActivityShares),
        this.adapters.db.insertOrderedItem(followeeOutboxId, acceptActivityId),
        this.adapters.db.insertItem(followersId, followerId),
    ]);
    await this.adapters.delivery.broadcast(acceptActivity, followee);
}
exports.handleFollow = handleFollow;
//# sourceMappingURL=follow.js.map