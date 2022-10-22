"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAdd = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAdd() {
    if (!('object' in this.activity) || !('target' in this.activity)) {
        return;
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(this.activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    if (!this.activity.target) {
        throw new Error('Bad activity: must have target.');
    }
    const targetId = (0, activitypub_core_utilities_1.getId)(this.activity.target);
    if (!targetId) {
        throw new Error('Bad target: no ID.');
    }
    const target = await this.databaseService.findEntityById(targetId);
    if (!target) {
        throw new Error('Bad target: not found, only local allowed.');
    }
    if ('orderedItems' in target && Array.isArray(target.orderedItems)) {
        await this.databaseService.insertOrderedItem(targetId, objectId);
    }
    else if ('items' in target && Array.isArray(target.items)) {
        await this.databaseService.insertItem(targetId, objectId);
    }
    else {
        throw new Error('Bad target: not a collection.');
    }
}
exports.handleAdd = handleAdd;
//# sourceMappingURL=add.js.map