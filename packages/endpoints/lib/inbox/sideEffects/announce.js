"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnnounce = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function handleAnnounce(activity, recipient) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.ANNOUNCE);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, types_1.assertExists)(objectId);
    const object = await this.core.findEntityById(objectId);
    try {
        (0, types_1.assertIsApExtendedObject)(object);
        const sharesId = (0, utilities_1.getId)(object.shares);
        const shares = await this.core.findEntityById(sharesId);
        (0, types_1.assertIsApCollection)(shares);
        const attributedToId = (0, utilities_1.getId)(shares.attributedTo);
        (0, types_1.assertExists)(attributedToId);
        if (attributedToId.toString() !== (0, utilities_1.getId)(recipient)?.toString()) {
            return;
        }
        if (Array.isArray(shares.type)
            ? shares.type.includes(types_1.AP.CollectionTypes.COLLECTION)
            : shares.type === types_1.AP.CollectionTypes.COLLECTION) {
            await this.core.insertItem(sharesId, activity.id);
        }
        else if (Array.isArray(shares.type)
            ? shares.type.includes(types_1.AP.CollectionTypes.ORDERED_COLLECTION)
            : shares.type === types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
            await this.core.insertOrderedItem(sharesId, activity.id);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map