"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndo = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUndo() {
    if (!('object' in this.activity)) {
        throw new Error('Bad activity: no object.');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(this.activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.adapters.db.findEntityById(objectId);
    if (!object) {
        throw new Error('Bad object: not found.');
    }
    if (!isActorAuthorizedToModifyObject(this.actor, this.activity)) {
        throw new Error('Not authorized to modify object!');
    }
    if ((0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.CREATE)) {
        await this.handleDelete(object);
    }
    if ((0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.BLOCK)) {
        await this.handleUndoBlock(object);
    }
    if ((0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.LIKE)) {
        await this.handleUndoLike(object);
    }
    if ((0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE)) {
        await this.handleUndoAnnounce(object);
    }
    if ((0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.ADD)) {
        await this.handleRemove(object);
    }
    if ((0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.REMOVE)) {
        await this.handleAdd(object);
    }
}
exports.handleUndo = handleUndo;
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
    const activityActorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const activityActorAttributedTo = (0, activitypub_core_utilities_1.getId)(activity.attributedTo);
    if (activityActorId?.toString() === initiatorId.toString()) {
        return true;
    }
    if (activityActorAttributedTo?.toString() === initiatorId.toString()) {
        return true;
    }
}
//# sourceMappingURL=index.js.map