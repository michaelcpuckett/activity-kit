"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLike = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleLike(activity, databaseService) {
    if (!activity.id) {
        throw new Error('bad request; no id');
    }
    const activityObjectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!activityObjectId) {
        throw new Error('Bad request; no activity');
    }
    const foundThing = await databaseService.findEntityById(activityObjectId);
    if (!foundThing || !foundThing.type) {
        return;
    }
    if (!('likes' in foundThing && foundThing.likes)) {
        throw new Error('bad request - no likes collection.');
    }
    const likesCollectionId = foundThing.likes instanceof URL ? foundThing.likes : foundThing.likes.id;
    if (!likesCollectionId) {
        throw new Error('bad request ; no likes collection');
    }
    const likesCollection = await databaseService.findEntityById(likesCollectionId);
    if (!likesCollection) {
        throw new Error('bad request ;; no likes collection');
    }
    if (likesCollection.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION ||
        (Array.isArray(likesCollection.type) &&
            likesCollection.type.includes(activitypub_core_types_1.AP.CollectionTypes.COLLECTION))) {
        await databaseService.insertItem(likesCollectionId, activity.id);
    }
    else if (likesCollection.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION ||
        (Array.isArray(likesCollection.type) &&
            likesCollection.type.includes(activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION))) {
        await databaseService.insertOrderedItem(likesCollectionId, activity.id);
    }
}
exports.handleLike = handleLike;
//# sourceMappingURL=like.js.map