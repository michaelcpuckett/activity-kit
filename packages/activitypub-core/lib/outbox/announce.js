"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnnounce = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAnnounce(activity, databaseService) {
    const activityActorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    if (!activityActorId) {
        throw new Error('No actor ID.');
    }
    const actor = await databaseService.queryById(activityActorId);
    if (!actor || !('outbox' in actor)) {
        throw new Error('No actor.');
    }
    const activityObjectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('Bad request 1');
    }
    const object = await databaseService.queryById(activityObjectId);
    if (!object) {
        throw new Error('Bad request 2');
    }
    if (!('id' in object) || !object.id) {
        throw new Error('Bad request 3');
    }
    if (!('shares' in object) || !object.shares) {
        throw new Error('Bad request 4');
    }
    const objectSharesId = (0, activitypub_core_utilities_1.getId)(object.shares);
    if (!objectSharesId) {
        throw new Error('Bad request 5');
    }
    if (!activity.id) {
        throw new Error('Bad request 6');
    }
    if (!('streams' in actor) ||
        !actor.streams ||
        !Array.isArray(actor.streams)) {
        throw new Error('bad request 9');
    }
    const actorStreams = await Promise.all(actor.streams
        .map((stream) => (stream instanceof URL ? stream : stream.id))
        .map(async (id) => (id ? await databaseService.queryById(id) : null)));
    const actorSharedCollection = actorStreams.find((stream) => {
        if (stream && 'name' in stream) {
            if (stream.name === 'Shared') {
                return true;
            }
        }
    });
    if (!actorSharedCollection || !actorSharedCollection.id) {
        throw new Error('bad request');
    }
    await Promise.all([
        databaseService.insertOrderedItem(objectSharesId, activity.id),
        databaseService.insertOrderedItem(actorSharedCollection.id, object.id),
    ]);
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map