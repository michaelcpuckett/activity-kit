"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdate = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUpdate(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.UPDATE);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const actor = await this.adapters.db.findEntityById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    if (activity.object instanceof URL) {
        throw new Error('Bad activity: Providing a URL for the object is not sufficient for Update.');
    }
    if (Array.isArray(activity.object)) {
        throw new Error('Internal server error: Object arrays not supported. TODO.');
    }
    if (!isActorAuthorizedToModifyObject(actor, activity)) {
        throw new Error('Not authorized to modify object!');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    const object = await this.adapters.db.findEntityById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    activity.object = {
        ...object,
        ...activity.object,
        ...(object.type !== 'Link' && object.type !== 'Mention' ? {
            updated: new Date(),
        } : null),
    };
    await this.adapters.db.saveEntity(activity.object);
}
exports.handleUpdate = handleUpdate;
function isActorAuthorizedToModifyObject(initiator, activity) {
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
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const attributedTo = (0, activitypub_core_utilities_1.getId)(activity.attributedTo);
    if (actorId?.toString() === initiatorId.toString()) {
        return true;
    }
    if (attributedTo?.toString() === initiatorId.toString()) {
        return true;
    }
}
//# sourceMappingURL=update.js.map