"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLike = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function handleLike(activity, recipient) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.LIKE);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, types_1.assertExists)(objectId);
    const object = await this.core.findEntityById(objectId);
    (0, types_1.assertIsApEntity)(object);
    try {
        (0, types_1.assertIsApExtendedObject)(object);
        const likesId = (0, utilities_1.getId)(object.likes);
        (0, types_1.assertExists)(likesId);
        const likes = await this.core.findEntityById(likesId);
        (0, types_1.assertIsApCollection)(likes);
        const attributedToId = (0, utilities_1.getId)(likes.attributedTo);
        (0, types_1.assertExists)(attributedToId);
        if (attributedToId.toString() !== (0, utilities_1.getId)(recipient)?.toString()) {
            return;
        }
        if ((0, utilities_1.isType)(likes, types_1.AP.CollectionTypes.COLLECTION)) {
            await this.core.insertItem(likesId, activity.id);
        }
        else if ((0, utilities_1.isType)(likes, types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
            await this.core.insertOrderedItem(likesId, activity.id);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleLike = handleLike;
//# sourceMappingURL=like.js.map