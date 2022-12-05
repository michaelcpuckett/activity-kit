"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoAnnounce = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUndoAnnounce(activity) {
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
    if (!('streams' in actor) ||
        !actor.streams ||
        !Array.isArray(actor.streams)) {
        throw new Error('Bad actor: no streams.');
    }
    const streams = await Promise.all(actor.streams
        .map((stream) => (stream instanceof URL ? stream : stream.id))
        .map(async (id) => id ? await this.adapters.db.queryById(id) : null));
    const shared = streams.find((stream) => {
        if (stream && 'name' in stream) {
            if (stream.name === 'Shared') {
                return true;
            }
        }
    });
    if (!shared || !shared.id) {
        throw new Error('Bad actor: no shared collection.');
    }
    console.log(`Removing ${objectId} from ${shared.id}`);
    await Promise.all([
        this.adapters.db.removeOrderedItem(shared.id, objectId),
    ]);
}
exports.handleUndoAnnounce = handleUndoAnnounce;
//# sourceMappingURL=undoAnnounce.js.map