"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoBlock = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
async function handleUndoBlock(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.BLOCK);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.queryById(actorId);
    (0, types_1.assertIsApActor)(actor);
    const blocks = await this.core.getStreamByName(actor, 'Blocks');
    (0, types_1.assertIsApType)(blocks, types_1.AP.CollectionTypes.COLLECTION);
    await this.core.removeItem(blocks.id, activity.id);
}
exports.handleUndoBlock = handleUndoBlock;
//# sourceMappingURL=undoBlock.js.map