"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFollow = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const activitypub_core_utilities_4 = require("activitypub-core-utilities");
async function handleFollow(activity, databaseService, deliveryService) {
    if (!activity.id) {
        throw new Error('bad request');
    }
    const activityObjectId = (0, activitypub_core_utilities_4.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('No object id');
    }
    const foundObject = await databaseService.queryById(activityObjectId);
    if (!foundObject || !foundObject.type || !foundObject.id) {
        throw new Error('No found object');
    }
    const typedObject = (0, activitypub_core_utilities_1.getTypedEntity)(foundObject);
    if (!typedObject || !('inbox' in typedObject)) {
        return;
    }
    const activityActorId = (0, activitypub_core_utilities_4.getId)(activity.actor);
    if (!activityActorId) {
        throw new Error('Bad request 1');
    }
    const foundActor = await databaseService.queryById(activityActorId);
    if (!foundActor || !foundActor.type) {
        throw new Error('No actor found');
    }
    const typedActor = (0, activitypub_core_utilities_1.getTypedEntity)(foundActor);
    if (!typedActor || !('inbox' in typedActor)) {
        throw new Error('actor not an actor?');
    }
    const follower = typedActor;
    const followee = typedObject;
    if (!(follower.id && followee.id)) {
        return;
    }
    const acceptActivityId = `${activitypub_core_utilities_3.LOCAL_DOMAIN}/activity/${(0, activitypub_core_utilities_2.getGuid)()}`;
    const acceptActivity = {
        '@context': activitypub_core_utilities_3.ACTIVITYSTREAMS_CONTEXT,
        id: new URL(acceptActivityId),
        url: new URL(acceptActivityId),
        type: activitypub_core_types_1.AP.ActivityTypes.ACCEPT,
        actor: followee.id,
        object: activity.id,
        to: [new URL(activitypub_core_utilities_3.PUBLIC_ACTOR), follower.id],
    };
    const followeeOutboxId = (0, activitypub_core_utilities_4.getId)(followee.outbox);
    if (!followeeOutboxId) {
        throw new Error('No followee Outbox ID');
    }
    const followeeFollowersId = (0, activitypub_core_utilities_4.getId)(followee.followers);
    if (!followeeFollowersId) {
        throw new Error('no followee Followers ID');
    }
    if (!acceptActivity.id) {
        throw new Error('bad request');
    }
    await Promise.all([
        databaseService.saveEntity(acceptActivity),
        databaseService.insertOrderedItem(followeeOutboxId, acceptActivity.id),
        databaseService.insertItem(followeeFollowersId, follower.id),
    ]);
    await deliveryService.broadcast(acceptActivity, followee);
}
exports.handleFollow = handleFollow;
//# sourceMappingURL=follow.js.map