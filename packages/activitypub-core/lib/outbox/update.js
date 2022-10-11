"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdate = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUpdate(activity, databaseService) {
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    if (!actorId) {
        throw new Error('No actor?');
    }
    const actor = await databaseService.findEntityById(actorId);
    if (!actor) {
        throw new Error('No actor?');
    }
    if (!isAuthorizedToModifyObject(actor, activity)) {
        throw new Error('Not authorized');
    }
    if (activity.object instanceof URL || Array.isArray(activity.object)) {
        throw new Error('bad request');
    }
    const activityObjectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('Bad request xxx1');
    }
    const objectToUpdate = await databaseService.findEntityById(activityObjectId);
    if (!objectToUpdate || !objectToUpdate.type) {
        throw new Error('bad request xxx');
    }
    if (!activity.object ||
        objectToUpdate instanceof URL ||
        activity.object instanceof URL) {
        throw new Error('bad request x2');
    }
    activity.object = {
        ...objectToUpdate,
        ...activity.object,
        ...(objectToUpdate.type !== 'Link' && objectToUpdate.type !== 'Mention'
            ? {
                updated: new Date(),
            }
            : null),
    };
    await databaseService.saveEntity(activity.object);
}
exports.handleUpdate = handleUpdate;
function isAuthorizedToModifyObject(initiator, activity) {
    const initiatorId = (0, activitypub_core_utilities_1.getId)(initiator);
    if (!initiatorId) {
        return false;
    }
    if (Array.isArray(activity.attributedTo) &&
        activity.attributedTo.find((reference) => {
            const id = (0, activitypub_core_utilities_1.getId)(reference);
            if (id && id.toString() === initiatorId.toString()) {
                return true;
            }
        })) {
        return true;
    }
    const activityActorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const activityActorAttributedTo = (0, activitypub_core_utilities_1.getId)(activity.attributedTo);
    if (activityActorId?.toString() === initiatorId.toString()) {
        return true;
    }
    if (activityActorAttributedTo?.toString() === initiatorId.toString()) {
        return true;
    }
}
//# sourceMappingURL=update.js.map