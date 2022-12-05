"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBlock = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleBlock() {
    if (!this.activity) {
        return;
    }
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
    if (!(0, activitypub_core_utilities_1.isTypeOf)(object, activitypub_core_types_1.AP.ActorTypes)) {
        return;
    }
    if (!('streams' in actor) ||
        !actor.streams ||
        !Array.isArray(actor.streams)) {
        throw new Error("Actor's streams not found.");
    }
    const streams = await Promise.all(actor.streams
        .map((stream) => stream instanceof URL ? stream : stream.id)
        .map(async (id) => id ? await this.adapters.db.findEntityById(id) : null));
    const blocks = streams.find((stream) => {
        if (stream && 'name' in stream) {
            if (stream.name === 'Blocks') {
                return true;
            }
        }
    });
    if (!blocks || !blocks.id) {
        throw new Error('Bad blocks collection: not found.');
    }
    await Promise.all([
        this.adapters.db.insertItem(blocks.id, this.activity.id)
    ]);
}
exports.handleBlock = handleBlock;
//# sourceMappingURL=block.js.map