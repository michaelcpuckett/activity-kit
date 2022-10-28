"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDelete = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleDelete(activity) {
    activity = activity || this.activity;
    if (!('object' in activity)) {
        throw new Error('Bad activity: no object.');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    if (!objectId) {
        throw new Error('Bad object: not ID.');
    }
    const object = await this.adapters.db.findEntityById(objectId);
    if (!object || !object.type) {
        throw new Error('Bad object: not found.');
    }
    activity.object = {
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
    await this.adapters.db.saveEntity(activity.object);
}
exports.handleDelete = handleDelete;
//# sourceMappingURL=delete.js.map