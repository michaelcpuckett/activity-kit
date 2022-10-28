"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoLike = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUndoLike(activity) {
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
    if (!('likes' in object) || !object.likes) {
        throw new Error('Bad object: no `likes` collection.');
    }
    const likesId = (0, activitypub_core_utilities_1.getId)(object.likes);
    if (!likesId) {
        throw new Error('Bad likes collection: no ID.');
    }
    if (!('liked' in actor) || !actor.liked) {
        throw new Error('Bad actor: No liked collection.');
    }
    const likedId = (0, activitypub_core_utilities_1.getId)(actor.liked);
    if (!likedId) {
        throw new Error('Bad liked collection: no ID');
    }
    await Promise.all([
        this.adapters.db.removeOrderedItem(likesId, activity.id),
        this.adapters.db.removeOrderedItem(likedId, object.id),
    ]);
}
exports.handleUndoLike = handleUndoLike;
//# sourceMappingURL=undoLike.js.map