"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLike = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleLike() {
    const activity = this.activity;
    if (!('object' in activity)) {
        throw new Error('Bad activity: no object.');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.databaseService.findEntityById(objectId);
    if (!object) {
        return;
    }
    if (!('likes' in object) || !object.likes) {
        throw new Error('Bad object: no likes collection.');
    }
    const likesId = (0, activitypub_core_utilities_1.getId)(object.likes);
    if (!likesId) {
        throw new Error('Bad likes collection: no ID.');
    }
    const likes = await this.databaseService.findEntityById(likesId);
    if (!likes) {
        throw new Error('Bad likes collection: not found.');
    }
    if ((0, activitypub_core_utilities_1.isType)(likes, activitypub_core_types_1.AP.CollectionTypes.COLLECTION)) {
        await this.databaseService.insertItem(likesId, activity.id);
    }
    else if ((0, activitypub_core_utilities_1.isType)(likes, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
        await this.databaseService.insertOrderedItem(likesId, activity.id);
    }
}
exports.handleLike = handleLike;
//# sourceMappingURL=like.js.map