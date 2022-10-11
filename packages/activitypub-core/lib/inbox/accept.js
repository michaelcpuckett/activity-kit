"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAccept = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAccept(activity, databaseService) {
    const activityObjectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('Bad request 1');
    }
    const foundThing = await databaseService.queryById(activityObjectId);
    if (!foundThing || !foundThing.type) {
        throw new Error('bad request 2');
    }
    if (foundThing.type !== activitypub_core_types_1.AP.ActivityTypes.FOLLOW) {
        return;
    }
    const followActivity = foundThing;
    const followerId = (0, activitypub_core_utilities_1.getId)(followActivity.actor);
    const followeeId = (0, activitypub_core_utilities_1.getId)(followActivity.object);
    if (!followerId || !followeeId) {
        throw new Error('bad request 4');
    }
    const foundFollower = await databaseService.queryById(followerId);
    if (!foundFollower || !('outbox' in foundFollower)) {
        throw new Error('bad request 55');
    }
    const foundFollowee = await databaseService.queryById(followeeId);
    if (!foundFollowee || !('outbox' in foundFollowee)) {
        throw new Error('bad request 5');
    }
    const followeeFollowersId = (0, activitypub_core_utilities_1.getId)(foundFollowee.followers);
    if (!followeeFollowersId) {
        throw new Error('bad request 6');
    }
    await databaseService.insertItem(followeeFollowersId, followerId);
    const followerFollowingId = (0, activitypub_core_utilities_1.getId)(foundFollower.following);
    if (!followerFollowingId) {
        throw new Error('bad request 7');
    }
    await databaseService.insertItem(followerFollowingId, followeeId);
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map