"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLike = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleLike(activity, recipient) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.LIKE);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const object = await this.lib.findEntityById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    try {
        (0, activitypub_core_types_1.assertIsApExtendedObject)(object);
        const likesId = (0, activitypub_core_utilities_1.getId)(object.likes);
        (0, activitypub_core_types_1.assertExists)(likesId);
        const likes = await this.lib.findEntityById(likesId);
        (0, activitypub_core_types_1.assertIsApCollection)(likes);
        const attributedToId = (0, activitypub_core_utilities_1.getId)(likes.attributedTo);
        (0, activitypub_core_types_1.assertExists)(attributedToId);
        if (attributedToId.toString() !== (0, activitypub_core_utilities_1.getId)(recipient)?.toString()) {
            return;
        }
        if ((0, activitypub_core_utilities_1.isType)(likes, activitypub_core_types_1.AP.CollectionTypes.COLLECTION)) {
            await this.lib.insertItem(likesId, activity.id);
        }
        else if ((0, activitypub_core_utilities_1.isType)(likes, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
            await this.lib.insertOrderedItem(likesId, activity.id);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleLike = handleLike;
//# sourceMappingURL=like.js.map