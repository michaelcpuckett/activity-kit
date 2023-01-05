"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoBlock = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
async function handleUndoBlock(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.BLOCK);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const actor = await this.adapters.db.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const blocks = await this.adapters.db.getStreamByName(actor, 'Blocks');
    (0, activitypub_core_types_1.assertIsApType)(blocks, activitypub_core_types_1.AP.CollectionTypes.COLLECTION);
    await this.adapters.db.removeItem(blocks.id, activity.id);
}
exports.handleUndoBlock = handleUndoBlock;
//# sourceMappingURL=undoBlock.js.map