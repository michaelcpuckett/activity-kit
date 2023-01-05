"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAccept = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAccept(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.ACCEPT);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const object = await this.adapters.db.findEntityById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    if (!(0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.FOLLOW)) {
        return;
    }
    const followActivity = object;
    (0, activitypub_core_types_1.assertIsApType)(followActivity, activitypub_core_types_1.AP.ActivityTypes.FOLLOW);
    const followerId = (0, activitypub_core_utilities_1.getId)(followActivity.actor);
    (0, activitypub_core_types_1.assertExists)(followerId);
    const follower = await this.adapters.db.queryById(followerId);
    (0, activitypub_core_types_1.assertIsApActor)(follower);
    const followeeId = (0, activitypub_core_utilities_1.getId)(followActivity.object);
    (0, activitypub_core_types_1.assertExists)(followeeId);
    const followee = await this.adapters.db.queryById(followeeId);
    (0, activitypub_core_types_1.assertIsApActor)(followee);
    const followingId = (0, activitypub_core_utilities_1.getId)(follower.following);
    (0, activitypub_core_types_1.assertExists)(followingId);
    const following = await this.adapters.db.queryById(followingId);
    (0, activitypub_core_types_1.assertIsApType)(following, activitypub_core_types_1.AP.CollectionTypes.COLLECTION);
    (0, activitypub_core_types_1.assertIsArray)(following.items);
    if (following.items
        .map((item) => (0, activitypub_core_utilities_1.getId)(item)?.toString())
        .includes(followeeId.toString())) {
        console.log('Already following.');
        return;
    }
    await this.adapters.db.insertItem(followingId, followeeId);
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map