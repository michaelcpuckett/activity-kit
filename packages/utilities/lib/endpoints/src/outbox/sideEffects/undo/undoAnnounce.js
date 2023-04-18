"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoAnnounce = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
async function handleUndoAnnounce(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.ANNOUNCE);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.queryById(actorId);
    (0, types_1.assertIsApActor)(actor);
    const shared = await this.core.getStreamByName(actor, 'Shared');
    (0, types_1.assertIsApType)(shared, types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    await this.core.removeOrderedItem(shared.id, activity.id);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, types_1.assertExists)(objectId);
    if ((0, utilities_1.isLocal)(objectId)) {
        const object = await this.core.queryById(objectId);
        (0, types_1.assertIsApEntity)(object);
        if (!('shares' in object)) {
            throw new Error('Object is local, but `shares` is not in this object.');
        }
        const sharesId = (0, utilities_1.getId)(object.shares);
        if (!sharesId) {
            throw new Error('Bad shares collection: no ID.');
        }
        await this.core.removeOrderedItem(sharesId, activity.id);
    }
}
exports.handleUndoAnnounce = handleUndoAnnounce;
//# sourceMappingURL=undoAnnounce.js.map