"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnnounce = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAnnounce() {
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
    const actor = await this.adapters.db.queryById(actorId);
    if (!actor || !('outbox' in actor)) {
        throw new Error('Bad actor: not found or no outbox.');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(this.activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.adapters.db.queryById(objectId);
    if (!object) {
        throw new Error('Bad object: not found.');
    }
    if (!('id' in object) || !object.id) {
        throw new Error('Bad object: no ID.');
    }
    if (!('streams' in actor) ||
        !actor.streams ||
        !Array.isArray(actor.streams)) {
        throw new Error("Actor's streams not found.");
    }
    const streams = await Promise.all(actor.streams
        .map((stream) => stream instanceof URL ? stream : stream.id)
        .map(async (id) => id ? await this.adapters.db.findEntityById(id) : null));
    const shared = streams.find((stream) => {
        if (stream && 'name' in stream) {
            if (stream.name === 'Shared') {
                return true;
            }
        }
    });
    if (!shared || !shared.id) {
        throw new Error('Bad shared collection: not found.');
    }
    await Promise.all([this.adapters.db.insertOrderedItem(shared.id, this.activity.id)]);
    const isLocal = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(object.id) !== 'foreign-entity';
    if (isLocal) {
        if (!('shares' in object) || !object.shares) {
            throw new Error('Object is local, but `shares` is not in this object.');
        }
        const sharesId = (0, activitypub_core_utilities_1.getId)(object.shares);
        if (!sharesId) {
            throw new Error('Bad shares collection: no ID.');
        }
        await Promise.all([
            this.adapters.db.insertOrderedItem(sharesId, this.activity.id),
        ]);
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map