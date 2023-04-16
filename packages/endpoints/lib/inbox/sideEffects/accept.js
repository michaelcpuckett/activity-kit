"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAccept = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function handleAccept(activity, recipient) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.ACCEPT);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, types_1.assertExists)(objectId);
    const object = await this.core.findEntityById(objectId);
    (0, types_1.assertIsApEntity)(object);
    if (!(0, utilities_1.isType)(object, types_1.AP.ActivityTypes.FOLLOW)) {
        return;
    }
    const followActivity = object;
    (0, types_1.assertIsApType)(followActivity, types_1.AP.ActivityTypes.FOLLOW);
    const followerId = (0, utilities_1.getId)(followActivity.actor);
    (0, types_1.assertExists)(followerId);
    if (followerId.toString() !== (0, utilities_1.getId)(recipient)?.toString()) {
        return;
    }
    const follower = await this.core.queryById(followerId);
    (0, types_1.assertIsApActor)(follower);
    const followeeId = (0, utilities_1.getId)(followActivity.object);
    (0, types_1.assertExists)(followeeId);
    const followee = await this.core.queryById(followeeId);
    (0, types_1.assertIsApActor)(followee);
    const followingId = (0, utilities_1.getId)(follower.following);
    (0, types_1.assertExists)(followingId);
    const following = await this.core.queryById(followingId);
    (0, types_1.assertIsApType)(following, types_1.AP.CollectionTypes.COLLECTION);
    (0, types_1.assertIsArray)(following.items);
    if (following.items
        .map((item) => (0, utilities_1.getId)(item)?.toString())
        .includes(followeeId.toString())) {
        console.log('Already following.');
        return;
    }
    await this.core.insertItem(followingId, followeeId);
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map