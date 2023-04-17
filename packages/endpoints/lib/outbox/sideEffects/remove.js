"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRemove = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function handleRemove(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.REMOVE);
    const objectId = (0, utilities_1.getId)(activity.object);
    const targetId = (0, utilities_1.getId)(activity.target);
    const target = await this.core.findEntityById(targetId);
    (0, types_1.assertIsApCollection)(target);
    if (target.attributedTo) {
        const actorId = (0, utilities_1.getId)(activity.actor);
        const attributedToId = (0, utilities_1.getId)(target.attributedTo);
        if (attributedToId?.toString() !== actorId?.toString()) {
            throw new Error('Not allowed.');
        }
    }
    if (Array.isArray(target.type)
        ? target.type.includes(types_1.AP.CollectionTypes.ORDERED_COLLECTION)
        : target.type === types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
        await this.core.removeOrderedItem(targetId, objectId);
    }
    else if (Array.isArray(target.type)
        ? target.type.includes(types_1.AP.CollectionTypes.COLLECTION)
        : target.type === types_1.AP.CollectionTypes.COLLECTION) {
        await this.core.removeItem(targetId, objectId);
    }
    else {
        throw new Error('Bad target: Not a collection.');
    }
}
exports.handleRemove = handleRemove;
//# sourceMappingURL=remove.js.map