"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoFollow = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
async function handleUndoFollow(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.FOLLOW);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.queryById(actorId);
    (0, types_1.assertIsApActor)(actor);
    const followingId = (0, utilities_1.getId)(actor.following);
    (0, types_1.assertExists)(followingId);
    const objectId = (0, utilities_1.getId)(activity.object);
    const object = await this.core.queryById(objectId);
    (0, types_1.assertIsApActor)(object);
    await this.core.removeItem(followingId, objectId);
}
exports.handleUndoFollow = handleUndoFollow;
//# sourceMappingURL=undoFollow.js.map