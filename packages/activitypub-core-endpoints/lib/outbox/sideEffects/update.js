"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdate = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUpdate() {
    if (!('object' in this.activity)) {
        return;
    }
    const actorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
    if (!actorId) {
        throw new Error('Bad actor: no ID.');
    }
    const actor = await this.databaseService.findEntityById(actorId);
    if (!actor) {
        throw new Error('Bad actor: not found.');
    }
    if (!isActorAuthorizedToModifyObject(actor, this.activity)) {
        throw new Error('Not authorized to modify object!');
    }
    if (this.activity.object instanceof URL) {
        throw new Error('Bad activity: Providing a URL for the object is not sufficient for Update.');
    }
    if (Array.isArray(this.activity.object)) {
        throw new Error('Internal server error: Object arrays not supported. TODO.');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(this.activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.databaseService.findEntityById(objectId);
    if (!object) {
        throw new Error('Bad object: Not found.');
    }
    const updatedObject = {
        ...object,
        ...this.activity.object,
        ...(object.type !== 'Link' && object.type !== 'Mention') ? {
            updated: new Date(),
        } : null,
    };
    await this.databaseService.saveEntity(updatedObject);
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