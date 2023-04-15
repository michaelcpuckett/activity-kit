"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoAccept = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
async function handleUndoAccept(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.ACCEPT);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const actor = await this.lib.findEntityById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const followersId = (0, activitypub_core_utilities_1.getId)(actor.followers);
    (0, activitypub_core_types_1.assertExists)(followersId);
    const followId = (0, activitypub_core_utilities_1.getId)(activity.object);
    const follow = await this.lib.queryById(followId);
    (0, activitypub_core_types_1.assertIsApType)(follow, activitypub_core_types_1.AP.ActivityTypes.FOLLOW);
    const followerId = (0, activitypub_core_utilities_1.getId)(follow.actor);
    (0, activitypub_core_types_1.assertExists)(followerId);
    await this.lib.removeItem(followersId, followerId);
}
exports.handleUndoAccept = handleUndoAccept;
//# sourceMappingURL=undoAccept.js.map