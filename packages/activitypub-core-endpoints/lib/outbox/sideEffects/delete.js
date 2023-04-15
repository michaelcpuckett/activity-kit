"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDelete = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleDelete(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.DELETE);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const object = await this.lib.findEntityById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    activity.object = {
        id: objectId,
        url: objectId,
        type: activitypub_core_types_1.AP.CoreObjectTypes.TOMBSTONE,
        deleted: new Date(),
        formerType: object.type,
    };
    await this.lib.saveEntity(activity.object);
}
exports.handleDelete = handleDelete;
//# sourceMappingURL=delete.js.map