"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoAccept = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
async function handleUndoAccept(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.ACCEPT);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.findEntityById(actorId);
    (0, types_1.assertIsApActor)(actor);
    const followersId = (0, utilities_1.getId)(actor.followers);
    (0, types_1.assertExists)(followersId);
    const followId = (0, utilities_1.getId)(activity.object);
    const follow = await this.core.queryById(followId);
    (0, types_1.assertIsApType)(follow, types_1.AP.ActivityTypes.FOLLOW);
    const followerId = (0, utilities_1.getId)(follow.actor);
    (0, types_1.assertExists)(followerId);
    await this.core.removeItem(followersId, followerId);
}
exports.handleUndoAccept = handleUndoAccept;
//# sourceMappingURL=undoAccept.js.map