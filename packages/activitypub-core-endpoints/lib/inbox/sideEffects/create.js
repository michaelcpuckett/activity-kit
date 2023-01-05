"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleCreate(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.CREATE);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const existingObject = await this.adapters.db.findEntityById(objectId);
    if (existingObject) {
        console.log('We have already received this object.');
        return;
    }
    const object = await this.adapters.db.queryById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    await this.adapters.db.saveEntity(object);
    try {
        (0, activitypub_core_types_1.assertIsApExtendedObject)(object);
        const inReplyToId = (0, activitypub_core_utilities_1.getId)(object.inReplyTo);
        (0, activitypub_core_types_1.assertExists)(inReplyToId);
        const inReplyTo = await this.adapters.db.findEntityById(inReplyToId);
        (0, activitypub_core_types_1.assertIsApExtendedObject)(inReplyTo);
        const repliesCollectionId = (0, activitypub_core_utilities_1.getId)(inReplyTo.replies);
        (0, activitypub_core_types_1.assertExists)(repliesCollectionId);
        const repliesCollection = await this.adapters.db.findEntityById(repliesCollectionId);
        (0, activitypub_core_types_1.assertIsApCollection)(repliesCollection);
        await this.adapters.db.insertOrderedItem(repliesCollectionId, objectId);
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map