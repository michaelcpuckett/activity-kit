"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFollow = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const utilities_2 = require("@activity-kit/utilities");
const utilities_3 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function handleFollow(activity, recipient) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.FOLLOW);
    const activityId = (0, utilities_3.getId)(activity);
    (0, types_1.assertExists)(activityId);
    const objectId = (0, utilities_3.getId)(activity.object);
    (0, types_1.assertExists)(objectId);
    const object = await this.core.queryById(objectId);
    (0, types_1.assertIsApEntity)(object);
    if (!(0, utilities_1.isTypeOf)(object, types_1.AP.ActorTypes)) {
        return;
    }
    (0, types_1.assertIsApActor)(object);
    const actorId = (0, utilities_3.getId)(activity.actor);
    (0, types_1.assertExists)(actorId);
    const actor = await this.core.queryById(actorId);
    (0, types_1.assertIsApActor)(actor);
    const follower = actor;
    const followerId = (0, utilities_3.getId)(follower);
    (0, types_1.assertExists)(followerId);
    const followee = object;
    const followeeId = (0, utilities_3.getId)(followee);
    (0, types_1.assertExists)(followeeId);
    if (followeeId.toString() !== (0, utilities_3.getId)(recipient)?.toString()) {
        return;
    }
    const followersId = (0, utilities_3.getId)(followee.followers);
    (0, types_1.assertExists)(followersId);
    const followers = await this.core.findEntityById(followersId);
    (0, types_1.assertIsApType)(followers, types_1.AP.CollectionTypes.COLLECTION);
    (0, types_1.assertIsArray)(followers.items);
    if (followers.items
        .map((id) => id?.toString())
        .includes(followerId.toString())) {
        console.log('Already a follower.');
        return;
    }
    if (followee.manuallyApprovesFollowers) {
        const requests = await this.core.getStreamByName(followee, 'Requests');
        (0, types_1.assertIsApType)(requests, types_1.AP.CollectionTypes.COLLECTION);
        const requestsId = (0, utilities_3.getId)(requests);
        await this.core.insertItem(requestsId, activityId);
        return;
    }
    const acceptActivityId = `${new URL(`${utilities_2.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.accept)({
        guid: await this.core.getGuid(),
    })}`)}`;
    const publishedDate = new Date();
    const acceptActivity = {
        '@context': utilities_2.ACTIVITYSTREAMS_CONTEXT,
        id: new URL(acceptActivityId),
        url: new URL(acceptActivityId),
        type: types_1.AP.ActivityTypes.ACCEPT,
        to: [new URL(utilities_2.PUBLIC_ACTOR), followerId],
        actor: followeeId,
        object: activityId,
        published: publishedDate,
    };
    const followeeOutboxId = (0, utilities_3.getId)(followee.outbox);
    (0, types_1.assertExists)(followeeOutboxId);
    await Promise.all([
        this.core.saveEntity(acceptActivity),
        this.core.insertOrderedItem(followeeOutboxId, new URL(acceptActivityId)),
        this.core.insertItem(followersId, followerId),
    ]);
    await this.core.broadcast(acceptActivity, followee);
}
exports.handleFollow = handleFollow;
//# sourceMappingURL=follow.js.map