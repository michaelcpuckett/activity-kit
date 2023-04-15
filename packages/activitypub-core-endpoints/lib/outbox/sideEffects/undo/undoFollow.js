"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoFollow = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
async function handleUndoFollow(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.FOLLOW);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const actor = await this.layers.data.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const followingId = (0, activitypub_core_utilities_1.getId)(actor.following);
    (0, activitypub_core_types_1.assertExists)(followingId);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    const object = await this.layers.data.queryById(objectId);
    (0, activitypub_core_types_1.assertIsApActor)(object);
    await this.layers.data.removeItem(followingId, objectId);
}
exports.handleUndoFollow = handleUndoFollow;
//# sourceMappingURL=undoFollow.js.map