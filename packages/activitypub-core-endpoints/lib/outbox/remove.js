"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRemove = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleRemove(activity, databaseService) {
    const activityObjectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('Bad request 1');
    }
    if (!activity.target) {
        throw new Error('Must have target.');
    }
    const activityTargetId = (0, activitypub_core_utilities_1.getId)(activity.target);
    if (!activityTargetId) {
        throw new Error('Bad request 2');
    }
    const expandedTarget = await databaseService.findEntityById(activityTargetId);
    if (!expandedTarget) {
        throw new Error('Bad request 3');
    }
    await databaseService.removeOrderedItem(activityTargetId, activityObjectId);
}
exports.handleRemove = handleRemove;
//# sourceMappingURL=remove.js.map