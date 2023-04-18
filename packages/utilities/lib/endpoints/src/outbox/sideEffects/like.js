"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLike = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function handleLike(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.LIKE);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.queryById(actorId);
    (0, types_1.assertIsApActor)(actor);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, types_1.assertExists)(objectId);
    const object = await this.core.queryById(objectId);
    (0, types_1.assertIsApEntity)(object);
    const likedId = (0, utilities_1.getId)(actor.liked);
    (0, types_1.assertExists)(likedId);
    await this.core.insertOrderedItem(likedId, objectId);
    try {
        (0, types_1.assertIsApExtendedObject)(object);
        const likesId = (0, utilities_1.getId)(object.likes);
        (0, types_1.assertExists)(likesId);
        if (!(0, utilities_1.isLocal)(objectId)) {
            throw new Error('Cannot add to remote collection.');
        }
        await this.core.insertOrderedItem(likesId, activity.id);
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleLike = handleLike;
//# sourceMappingURL=like.js.map