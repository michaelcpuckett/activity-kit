"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLike = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleLike() {
    if (!('object' in this.activity)) {
        throw new Error('Bad activity: no object.');
    }
    if (!this.activity.id) {
        throw new Error('Bad activity: no ID.');
    }
    const actorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
    if (!actorId) {
        throw new Error('Bad actor: no ID.');
    }
    const actor = await this.adapters.database.queryById(actorId);
    if (!actor || !('outbox' in actor)) {
        throw new Error('Bad actor: not found.');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(this.activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.adapters.database.queryById(objectId);
    if (!object) {
        throw new Error('Bad object: Not found.');
    }
    if (!('id' in object) || !object.id) {
        throw new Error('Bad object: No ID.');
    }
    if (!('liked' in actor) || !actor.liked) {
        throw new Error('Bad actor: No `liked` collection.');
    }
    const likedId = (0, activitypub_core_utilities_1.getId)(actor.liked);
    if (!likedId) {
        throw new Error('Bad liked collection: No ID.');
    }
    await Promise.all([
        this.adapters.database.insertOrderedItem(likedId, object.id),
    ]);
    const isLocal = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(object.id) !== 'foreign-object';
    if (isLocal) {
        if (!('likes' in object) || !object.likes) {
            throw new Error('Object is local, but has no `likes` collection.');
        }
        const likesId = (0, activitypub_core_utilities_1.getId)(object.likes);
        if (!likesId) {
            throw new Error('Bad likes collection: No ID.');
        }
        await Promise.all([
            this.adapters.database.insertOrderedItem(likesId, this.activity.id),
        ]);
    }
}
exports.handleLike = handleLike;
//# sourceMappingURL=like.js.map