"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAdd = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAdd(activity, databaseService) {
    const activityObjectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('No object ID');
    }
    if (!activity.target) {
        throw new Error('Must have target.');
    }
    const activityTargetId = (0, activitypub_core_utilities_1.getId)(activity.target);
    if (!activityTargetId) {
        throw new Error('No target ID');
    }
    const expandedTarget = await databaseService.findEntityById(activityTargetId);
    if (!expandedTarget) {
        throw new Error('Target not found, only local allowed');
    }
    if ('orderedItems' in expandedTarget &&
        Array.isArray(expandedTarget.orderedItems)) {
        await databaseService.insertOrderedItem(activityTargetId, activityObjectId);
    }
    else if ('items' in expandedTarget && Array.isArray(expandedTarget.items)) {
        await databaseService.insertItem(activityTargetId, activityObjectId);
    }
    else {
        throw new Error('Target not a collection.');
    }
}
exports.handleAdd = handleAdd;
//# sourceMappingURL=add.js.map