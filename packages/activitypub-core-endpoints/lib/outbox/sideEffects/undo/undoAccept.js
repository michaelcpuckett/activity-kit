"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoAccept = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUndoAccept(activity) {
    if (!('object' in activity)) {
        throw new Error('Bad activity: no object.');
    }
    if (!activity.id) {
        throw new Error('Bad activity: no ID.');
    }
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    if (!actorId) {
        throw new Error('Bad actor: no ID.');
    }
    const actor = await this.adapters.db.queryById(actorId);
    if (!actor || !('outbox' in actor)) {
        throw new Error('Bad actor: not found.');
    }
    const followId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!followId) {
        throw new Error('Bad follow object: no ID.');
    }
    const follow = await this.adapters.db.queryById(followId);
    if (!follow) {
        throw new Error('Bad follow object: not found.');
    }
    const followerId = (0, activitypub_core_utilities_1.getId)(follow.actor);
    if (!followerId) {
        throw new Error('Bad follower: no ID.');
    }
    await Promise.all([
        this.adapters.db.removeItem((0, activitypub_core_utilities_1.getId)(actor.followers), followerId),
    ]);
}
exports.handleUndoAccept = handleUndoAccept;
//# sourceMappingURL=undoAccept.js.map