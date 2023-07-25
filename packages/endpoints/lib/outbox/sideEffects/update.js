"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdate = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleUpdate(activity) {
    const actorId = (0, utilities_1.getId)(activity.actor);
    type_utilities_1.assert.exists(actorId);
    const actor = await this.core.findEntityById(actorId);
    type_utilities_1.assert.isApActor(actor);
    if (activity.object instanceof URL) {
        throw new Error('Bad activity: Providing a URL for the object is not sufficient for Update.');
    }
    if (Array.isArray(activity.object)) {
        throw new Error('Internal server error: Object arrays not supported. TODO.');
    }
    if (!isActorAuthorizedToModifyObject(actor, activity)) {
        throw new Error('Not authorized to modify object!');
    }
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    const existingObject = await this.core.findEntityById(objectId);
    type_utilities_1.assert.isApEntity(existingObject);
    const updatedObject = {
        ...existingObject,
    };
    for (const key of Object.keys(activity.object)) {
        updatedObject[key] = activity.object[key];
    }
    if (type_utilities_1.guard.isApCoreObject(updatedObject)) {
        updatedObject.updated = new Date();
    }
    await this.core.saveEntity(updatedObject);
}
exports.handleUpdate = handleUpdate;
function isActorAuthorizedToModifyObject(initiator, activity) {
    const initiatorId = (0, utilities_1.getId)(initiator);
    if (!type_utilities_1.guard.exists(initiatorId)) {
        return false;
    }
    const hasMatch = (0, utilities_1.getArray)(activity.attributedTo).find((attributedTo) => {
        const id = (0, utilities_1.getId)(attributedTo);
        return type_utilities_1.guard.exists(id) && id.href === initiatorId.href;
    });
    return !!hasMatch;
}
//# sourceMappingURL=update.js.map