"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnnounce = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAnnounce() {
    const activity = this.activity;
    if (!('object' in activity)) {
        throw new Error('Bad activity: no object.');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.databaseService.findEntityById(objectId);
    if (!object || !object.type || !object.id) {
        return;
    }
    if (!('shares' in object) || !object.shares) {
        throw new Error('Bad object: No shares collection.');
    }
    const sharesId = object.shares instanceof URL ? object.shares : object.shares.id;
    if (!sharesId) {
        throw new Error('Bad shares collection: no ID.');
    }
    const shares = await this.databaseService.findEntityById(sharesId);
    if (!shares) {
        throw new Error('Bad shares collection: not found');
    }
    if ((0, activitypub_core_utilities_1.isType)(shares, activitypub_core_types_1.AP.CollectionTypes.COLLECTION)) {
        await this.databaseService.insertItem(sharesId, activity.id);
    }
    else if ((0, activitypub_core_utilities_1.isType)(shares.type, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
        await this.databaseService.insertOrderedItem(sharesId, activity.id);
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map