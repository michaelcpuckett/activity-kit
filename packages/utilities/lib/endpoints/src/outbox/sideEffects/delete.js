"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDelete = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function handleDelete(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.DELETE);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, types_1.assertExists)(objectId);
    const object = await this.core.findEntityById(objectId);
    (0, types_1.assertIsApEntity)(object);
    activity.object = {
        id: objectId,
        url: objectId,
        type: types_1.AP.CoreObjectTypes.TOMBSTONE,
        deleted: new Date(),
        formerType: object.type,
    };
    await this.core.saveEntity(activity.object);
}
exports.handleDelete = handleDelete;
//# sourceMappingURL=delete.js.map