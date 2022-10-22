"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleCreate(activity, databaseService) {
    if (!activity.id || !activity.object) {
        throw new Error('bad request; no id/object');
    }
    const typedObject = (0, activitypub_core_utilities_1.getTypedEntity)(activity.object);
    if (!typedObject) {
        throw new Error('No object');
    }
    if ('inReplyTo' in typedObject && typedObject.inReplyTo) {
        const objectInReplyTo = await databaseService.findEntityById((0, activitypub_core_utilities_1.getId)(typedObject.inReplyTo));
        if (objectInReplyTo) {
            const repliesCollectionId = (0, activitypub_core_utilities_1.getId)(objectInReplyTo.replies);
            if (repliesCollectionId) {
                await databaseService.insertOrderedItem(repliesCollectionId, typedObject.id);
            }
        }
    }
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map