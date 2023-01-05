"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBlock = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_2 = require("activitypub-core-types");
async function handleBlock(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_2.AP.ActivityTypes.BLOCK);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const actor = await this.adapters.db.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const blocks = await this.adapters.db.getStreamByName(actor, 'Blocks');
    (0, activitypub_core_types_1.assertIsApType)(blocks, activitypub_core_types_2.AP.CollectionTypes.COLLECTION);
    await this.adapters.db.insertItem(blocks.id, activity.id);
}
exports.handleBlock = handleBlock;
//# sourceMappingURL=block.js.map