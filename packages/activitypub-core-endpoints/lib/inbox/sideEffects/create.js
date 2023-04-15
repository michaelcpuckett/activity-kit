"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleCreate(activity, recipient) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.CREATE);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const existingObject = await this.layers.data.findEntityById(objectId);
    if (existingObject) {
        console.log('We have already received this object.');
        return;
    }
    const object = await this.layers.data.queryById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    await this.layers.data.saveEntity(object);
    try {
        (0, activitypub_core_types_1.assertIsApExtendedObject)(object);
        const inReplyToId = (0, activitypub_core_utilities_1.getId)(object.inReplyTo);
        if (!inReplyToId) {
            return;
        }
        (0, activitypub_core_types_1.assertExists)(inReplyToId);
        const inReplyTo = await this.layers.data.findEntityById(inReplyToId);
        (0, activitypub_core_types_1.assertIsApExtendedObject)(inReplyTo);
        const repliesCollectionId = (0, activitypub_core_utilities_1.getId)(inReplyTo.replies);
        (0, activitypub_core_types_1.assertExists)(repliesCollectionId);
        const repliesCollection = await this.layers.data.findEntityById(repliesCollectionId);
        (0, activitypub_core_types_1.assertIsApCollection)(repliesCollection);
        const attributedToId = (0, activitypub_core_utilities_1.getId)(repliesCollection.attributedTo);
        (0, activitypub_core_types_1.assertExists)(attributedToId);
        console.log(attributedToId.toString(), (0, activitypub_core_utilities_1.getId)(recipient)?.toString());
        if (attributedToId.toString() !== (0, activitypub_core_utilities_1.getId)(recipient)?.toString()) {
            console.log('Not applicable to this Actor.');
            return;
        }
        await this.layers.data.insertOrderedItem(repliesCollectionId, objectId);
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map