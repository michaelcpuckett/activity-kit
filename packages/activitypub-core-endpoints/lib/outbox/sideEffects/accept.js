"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAccept = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAccept() {
    if (!(this.activity && 'object' in this.activity && 'actor' in this.activity)) {
        throw new Error('Bad activity: no object.');
    }
    const actorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
    const actor = await this.adapters.db.queryById(actorId);
    const followersId = (0, activitypub_core_utilities_1.getId)(actor.followers);
    const followActivityId = (0, activitypub_core_utilities_1.getId)(this.activity.object);
    const followActivity = await this.adapters.db.queryById(followActivityId);
    const followerId = (0, activitypub_core_utilities_1.getId)(followActivity.actor);
    if (!('streams' in actor) ||
        !actor.streams ||
        !Array.isArray(actor.streams)) {
        throw new Error("Actor's streams not found.");
    }
    const streams = await Promise.all(actor.streams.map(async (stream) => await this.adapters.db.findEntityById((0, activitypub_core_utilities_1.getId)(stream))));
    const requests = streams.find((stream) => {
        if (stream && 'name' in stream) {
            if (stream.name === 'Requests') {
                return true;
            }
        }
    });
    if (!requests || !requests.id) {
        throw new Error('Bad requests collection: not found.');
    }
    const requestsId = (0, activitypub_core_utilities_1.getId)(requests);
    await Promise.all([
        this.adapters.db.insertItem(followersId, followerId),
        this.adapters.db.removeItem(requestsId, followActivityId),
    ]);
}
exports.handleAccept = handleAccept;
//# sourceMappingURL=accept.js.map