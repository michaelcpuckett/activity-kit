"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDelete = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleDelete(activity, databaseService) {
    const activityObjectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('Bad request 7');
    }
    const objectToDelete = await databaseService.findEntityById(activityObjectId);
    if (!objectToDelete || !objectToDelete.type) {
        throw new Error('bad request 8');
    }
    activity.object = {
        id: activityObjectId,
        url: activityObjectId,
        type: activitypub_core_types_1.AP.CoreObjectTypes.TOMBSTONE,
        deleted: new Date(),
        formerType: objectToDelete.type,
    };
    await databaseService.saveEntity(activity.object);
}
exports.handleDelete = handleDelete;
//# sourceMappingURL=delete.js.map