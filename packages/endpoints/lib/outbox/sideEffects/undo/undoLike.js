"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoLike = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleUndoLike(activity) {
    const actorId = (0, utilities_1.getId)(activity.actor);
    type_utilities_1.assert.exists(actorId);
    const actor = await this.core.queryById(actorId);
    type_utilities_1.assert.isApActor(actor);
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    const likedId = (0, utilities_1.getId)(actor.liked);
    type_utilities_1.assert.exists(likedId);
    await this.core.removeOrderedItem(likedId, objectId);
    try {
        const object = await this.core.queryById(objectId);
        type_utilities_1.assert.isApExtendedObject(object);
        const likesId = (0, utilities_1.getId)(object.likes);
        type_utilities_1.assert.exists(likesId);
        if (!(0, utilities_1.isLocal)(objectId)) {
            throw new Error('Cannot add to remote collection.');
        }
        const activityId = (0, utilities_1.getId)(activity);
        type_utilities_1.assert.exists(activityId);
        await this.core.removeOrderedItem(likesId, activityId);
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleUndoLike = handleUndoLike;
//# sourceMappingURL=undoLike.js.map