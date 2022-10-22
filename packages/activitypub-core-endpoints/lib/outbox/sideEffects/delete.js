"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDelete = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleDelete() {
    if (!('object' in this.activity)) {
        return;
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(this.activity.object);
    if (!objectId) {
        throw new Error('Bad object: not ID.');
    }
    const object = await this.databaseService.findEntityById(objectId);
    if (!object || !object.type) {
        throw new Error('Bad object: not found.');
    }
    this.activity.object = {
        id: objectId,
        url: objectId,
        type: activitypub_core_types_1.AP.CoreObjectTypes.TOMBSTONE,
        deleted: new Date(),
        formerType: object.type,
        ...(object.created
            ? {
                created: object.created,
            }
            : null),
    };
    await this.databaseService.saveEntity(this.activity.object);
}
exports.handleDelete = handleDelete;
//# sourceMappingURL=delete.js.map