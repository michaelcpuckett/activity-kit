"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnnounce = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleAnnounce(activity, recipient) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const object = await this.adapters.db.findEntityById(objectId);
    try {
        (0, activitypub_core_types_1.assertIsApExtendedObject)(object);
        const sharesId = (0, activitypub_core_utilities_1.getId)(object.shares);
        const shares = await this.adapters.db.findEntityById(sharesId);
        (0, activitypub_core_types_1.assertIsApCollection)(shares);
        const attributedToId = (0, activitypub_core_utilities_1.getId)(shares.attributedTo);
        (0, activitypub_core_types_1.assertExists)(attributedToId);
        if (attributedToId.toString() !== (0, activitypub_core_utilities_1.getId)(recipient)?.toString()) {
            return;
        }
        if ((0, activitypub_core_utilities_1.isType)(shares, activitypub_core_types_1.AP.CollectionTypes.COLLECTION)) {
            await this.adapters.db.insertItem(sharesId, activity.id);
        }
        else if ((0, activitypub_core_utilities_1.isType)(shares, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
            await this.adapters.db.insertOrderedItem(sharesId, activity.id);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map