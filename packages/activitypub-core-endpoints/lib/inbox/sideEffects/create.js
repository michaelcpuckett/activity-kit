"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleCreate() {
    const activity = this.activity;
    if (!('object' in activity)) {
        throw new Error('Bad activity: no object.');
    }
    const object = activity.object;
    if ('inReplyTo' in object && object.inReplyTo) {
        const objectInReplyTo = await this.databaseService.findEntityById((0, activitypub_core_utilities_1.getId)(object.inReplyTo));
        if (objectInReplyTo) {
            const repliesCollectionId = (0, activitypub_core_utilities_1.getId)(objectInReplyTo.replies);
            if (repliesCollectionId) {
                await this.databaseService.insertOrderedItem(repliesCollectionId, object.id);
            }
        }
    }
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map