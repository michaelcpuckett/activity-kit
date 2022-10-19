"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnnounce = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAnnounce(activity, databaseService) {
    if (!activity.id) {
        throw new Error('bad request; no id');
    }
    const activityObjectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('Bad request wow');
    }
    const foundThing = await databaseService.findEntityById(activityObjectId);
    if (!foundThing || !foundThing.type || !foundThing.id) {
        return;
    }
    if (!('shares' in foundThing && foundThing.shares)) {
        throw new Error('bad request - no shares collection.');
    }
    const sharesCollectionId = foundThing.shares instanceof URL ? foundThing.shares : foundThing.shares.id;
    if (!sharesCollectionId) {
        throw new Error('bad request ; no shares collection id');
    }
    const sharesCollection = await databaseService.findEntityById(sharesCollectionId);
    if (!sharesCollection) {
        throw new Error('bad request; no shares collection');
    }
    if (sharesCollection.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION ||
        (Array.isArray(sharesCollection.type) &&
            sharesCollection.type.includes(activitypub_core_types_1.AP.CollectionTypes.COLLECTION))) {
        await databaseService.insertItem(sharesCollectionId, activity.id);
    }
    else if (sharesCollection.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION ||
        (Array.isArray(sharesCollection.type) &&
            sharesCollection.type.includes(activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION))) {
        await databaseService.insertOrderedItem(sharesCollectionId, activity.id);
    }
    if (!foundThing.attributedTo) {
        return;
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map