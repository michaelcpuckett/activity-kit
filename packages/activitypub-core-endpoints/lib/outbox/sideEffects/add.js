"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAdd = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
async function handleAdd(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.ADD);
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    const targetId = (0, activitypub_core_utilities_1.getId)(activity.target);
    const target = await this.layers.data.findEntityById(targetId);
    (0, activitypub_core_types_1.assertIsApCollection)(target);
    if (target.attributedTo) {
        const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
        const attributedToId = (0, activitypub_core_utilities_1.getId)(target.attributedTo);
        if (attributedToId?.toString() !== actorId?.toString()) {
            throw new Error('Not allowed.');
        }
    }
    if ((0, activitypub_core_utilities_1.isType)(target, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
        await this.layers.data.insertOrderedItem(targetId, objectId);
    }
    else if ((0, activitypub_core_utilities_1.isType)(target, activitypub_core_types_1.AP.CollectionTypes.COLLECTION)) {
        await this.layers.data.insertItem(targetId, objectId);
    }
    else {
        throw new Error('Bad target: Not a collection.');
    }
}
exports.handleAdd = handleAdd;
//# sourceMappingURL=add.js.map