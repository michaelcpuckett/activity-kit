"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnnounce = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function handleAnnounce(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.ANNOUNCE);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.queryById(actorId);
    (0, types_1.assertIsApActor)(actor);
    const shared = await this.core.getStreamByName(actor, 'Shared');
    (0, types_1.assertIsApType)(shared, types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    await this.core.insertOrderedItem(shared.id, activity.id);
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
        await this.core.insertOrderedItem(sharesId, activity.id);
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map