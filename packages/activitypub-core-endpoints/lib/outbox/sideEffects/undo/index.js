"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndo = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUndo(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.UNDO);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    const object = await this.lib.findEntityById(objectId);
    (0, activitypub_core_types_1.assertIsApActivity)(object);
    if (!isActorAuthorizedToModifyObject(this.actor, activity)) {
        throw new Error('Not authorized to modify object!');
    }
    if ((0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.CREATE)) {
        await this.handleDelete(object);
    }
    if ((0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.FOLLOW)) {
        await this.handleUndoFollow(object);
    }
    if ((0, activitypub_core_utilities_1.isType)(object, activitypub_core_types_1.AP.ActivityTypes.ACCEPT)) {
        await this.handleUndoAccept(object);
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