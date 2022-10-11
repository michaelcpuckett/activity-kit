"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndo = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const remove_1 = require("../remove");
const add_1 = require("../add");
const undoLike_1 = require("./undoLike");
const undoAnnounce_1 = require("./undoAnnounce");
const delete_1 = require("../delete");
async function handleUndo(activity, databaseService, initiator) {
    const activityObjectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('No activity object');
    }
    const activityObject = await databaseService.findEntityById(activityObjectId);
    if (!activityObject) {
        throw new Error('No activity object');
    }
    if (!isAuthorizedToModifyObject(initiator, activity)) {
        throw new Error('Not authorized');
    }
    switch (activityObject.type) {
        case activitypub_core_types_1.AP.ActivityTypes.CREATE:
            await (0, delete_1.handleDelete)(activityObject, databaseService);
            break;
        case activitypub_core_types_1.AP.ActivityTypes.LIKE:
            await (0, undoLike_1.handleUndoLike)(activityObject, databaseService);
            break;
        case activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE:
            await (0, undoAnnounce_1.handleUndoAnnounce)(activityObject, databaseService);
            break;
        case activitypub_core_types_1.AP.ActivityTypes.ADD:
            await (0, remove_1.handleRemove)(activityObject, databaseService);
            break;
        case activitypub_core_types_1.AP.ActivityTypes.REMOVE:
            await (0, add_1.handleAdd)(activityObject, databaseService);
            break;
    }
}
exports.handleUndo = handleUndo;
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
//# sourceMappingURL=index.js.map