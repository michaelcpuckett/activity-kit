"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoFollow = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUndoFollow(activity) {
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
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.adapters.db.queryById(objectId);
    if (!object) {
        throw new Error('Bad object: not found.');
    }
    await Promise.all([
        this.adapters.db.removeItem((0, activitypub_core_utilities_1.getId)(actor.following), objectId),
    ]);
}
exports.handleUndoFollow = handleUndoFollow;
//# sourceMappingURL=undoFollow.js.map