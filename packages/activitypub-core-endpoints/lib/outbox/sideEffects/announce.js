"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnnounce = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAnnounce(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const actor = await this.layers.data.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const shared = await this.layers.data.getStreamByName(actor, 'Shared');
    (0, activitypub_core_types_1.assertIsApType)(shared, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    await this.layers.data.insertOrderedItem(shared.id, activity.id);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const isLocal = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(objectId) !== 'foreignEntity';
    if (isLocal) {
        const object = await this.layers.data.queryById(objectId);
        (0, activitypub_core_types_1.assertIsApEntity)(object);
        if (!('shares' in object)) {
            throw new Error('Object is local, but `shares` is not in this object.');
        }
        const sharesId = (0, activitypub_core_utilities_1.getId)(object.shares);
        if (!sharesId) {
            throw new Error('Bad shares collection: no ID.');
        }
        await this.layers.data.insertOrderedItem(sharesId, activity.id);
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map