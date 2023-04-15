"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLike = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleLike(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.LIKE);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const actor = await this.lib.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const object = await this.lib.queryById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    const likedId = (0, activitypub_core_utilities_1.getId)(actor.liked);
    (0, activitypub_core_types_1.assertExists)(likedId);
    await this.lib.insertOrderedItem(likedId, objectId);
    try {
        (0, activitypub_core_types_1.assertIsApExtendedObject)(object);
        const likesId = (0, activitypub_core_utilities_1.getId)(object.likes);
        (0, activitypub_core_types_1.assertExists)(likesId);
        if (!(0, activitypub_core_utilities_1.isLocal)(objectId)) {
            throw new Error('Cannot add to remote collection.');
        }
        await this.lib.insertOrderedItem(likesId, activity.id);
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleLike = handleLike;
//# sourceMappingURL=like.js.map