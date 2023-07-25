"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoFollow = void 0;
const utilities_1 = require("@activity-kit/utilities");
const type_utilities_1 = require("@activity-kit/type-utilities");
async function handleUndoFollow(activity) {
    const actorId = (0, utilities_1.getId)(activity.actor);
    type_utilities_1.assert.exists(actorId);
    const actor = await this.core.queryById(actorId);
    type_utilities_1.assert.isApActor(actor);
    const followingId = (0, utilities_1.getId)(actor.following);
    type_utilities_1.assert.exists(followingId);
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    const object = await this.core.queryById(objectId);
    type_utilities_1.assert.isApActor(object);
    await this.core.removeItem(followingId, objectId);
}
exports.handleUndoFollow = handleUndoFollow;
//# sourceMappingURL=undoFollow.js.map