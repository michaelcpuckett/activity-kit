"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFollow = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function handleFollow(activity, recipient) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.FOLLOW);
    const activityId = (0, activitypub_core_utilities_3.getId)(activity);
    (0, activitypub_core_types_1.assertExists)(activityId);
    const objectId = (0, activitypub_core_utilities_3.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const object = await this.lib.queryById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    if (!(0, activitypub_core_utilities_1.isTypeOf)(object, activitypub_core_types_1.AP.ActorTypes)) {
        return;
    }
    (0, activitypub_core_types_1.assertIsApActor)(object);
    const actorId = (0, activitypub_core_utilities_3.getId)(activity.actor);
    (0, activitypub_core_types_1.assertExists)(actorId);
    const actor = await this.lib.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const follower = actor;
    const followerId = (0, activitypub_core_utilities_3.getId)(follower);
    (0, activitypub_core_types_1.assertExists)(followerId);
    const followee = object;
    const followeeId = (0, activitypub_core_utilities_3.getId)(followee);
    (0, activitypub_core_types_1.assertExists)(followeeId);
    if (followeeId.toString() !== (0, activitypub_core_utilities_3.getId)(recipient)?.toString()) {
        return;
    }
    const followersId = (0, activitypub_core_utilities_3.getId)(followee.followers);
    (0, activitypub_core_types_1.assertExists)(followersId);
    const followers = await this.lib.findEntityById(followersId);
    (0, activitypub_core_types_1.assertIsApType)(followers, activitypub_core_types_1.AP.CollectionTypes.COLLECTION);
    (0, activitypub_core_types_1.assertIsArray)(followers.items);
    if (followers.items
        .map((id) => id?.toString())
        .includes(followerId.toString())) {
        console.log('Already a follower.');
        return;
    }
    if (followee.manuallyApprovesFollowers) {
        const requests = await this.lib.getStreamByName(followee, 'Requests');
        (0, activitypub_core_types_1.assertIsApType)(requests, activitypub_core_types_1.AP.CollectionTypes.COLLECTION);
        const requestsId = (0, activitypub_core_utilities_3.getId)(requests);
        await this.lib.insertItem(requestsId, activityId);
        return;
    }
    const acceptActivityId = `${new URL(`${activitypub_core_utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.accept)({
        guid: await this.lib.getGuid(),
    })}`)}`;
    const publishedDate = new Date();
    const acceptActivity = {
        '@context': activitypub_core_utilities_2.ACTIVITYSTREAMS_CONTEXT,
        id: new URL(acceptActivityId),
        url: new URL(acceptActivityId),
        type: activitypub_core_types_1.AP.ActivityTypes.ACCEPT,
        to: [new URL(activitypub_core_utilities_2.PUBLIC_ACTOR), followerId],
        actor: followeeId,
        object: activityId,
        published: publishedDate,
    };
    const followeeOutboxId = (0, activitypub_core_utilities_3.getId)(followee.outbox);
    (0, activitypub_core_types_1.assertExists)(followeeOutboxId);
    await Promise.all([
        this.lib.saveEntity(acceptActivity),
        this.lib.insertOrderedItem(followeeOutboxId, new URL(acceptActivityId)),
        this.lib.insertItem(followersId, followerId),
    ]);
    await this.lib.broadcast(acceptActivity, followee);
}
exports.handleFollow = handleFollow;
//# sourceMappingURL=follow.js.map