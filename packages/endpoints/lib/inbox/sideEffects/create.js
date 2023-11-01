"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreate = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
// A create has been made, potentially in reply to a local object.
async function handleCreate(activity, recipient) {
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    const existingObject = await this.core.findEntityById(objectId);
    if (existingObject) {
        console.log('We have already received this object.');
        return;
    }
    const object = await this.core.queryById(objectId);
    type_utilities_1.assert.isApEntity(object);
    // Cache the object for comparison later.
    await this.core.saveEntity(object);
    try {
        type_utilities_1.assert.isApExtendedObject(object);
        const inReplyToId = (0, utilities_1.getId)(object.inReplyTo);
        if (!inReplyToId) {
            // Not applicable.
            return;
        }
        type_utilities_1.assert.exists(inReplyToId);
        const inReplyTo = await this.core.findEntityById(inReplyToId);
        type_utilities_1.assert.isApExtendedObject(inReplyTo);
        const repliesCollectionId = (0, utilities_1.getId)(inReplyTo.replies);
        type_utilities_1.assert.exists(repliesCollectionId);
        const repliesCollection = await this.core.findEntityById(repliesCollectionId);
        type_utilities_1.assert.isApCollection(repliesCollection);
        const attributedToId = (0, utilities_1.getId)(repliesCollection.attributedTo);
        type_utilities_1.assert.exists(attributedToId);
        if (attributedToId.toString() !== (0, utilities_1.getId)(recipient)?.toString()) {
            console.log('Not applicable to this Actor.');
            return;
        }
        await this.core.insertOrderedItem(repliesCollectionId, objectId);
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map