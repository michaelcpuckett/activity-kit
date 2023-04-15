"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBlock = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_2 = require("activitypub-core-types");
async function handleBlock(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_2.AP.ActivityTypes.BLOCK);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const actor = await this.layers.data.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const blockedActorId = (0, activitypub_core_utilities_1.getId)(activity.object);
    const blockedActor = await this.layers.data.queryById(blockedActorId);
    (0, activitypub_core_types_1.assertIsApActor)(blockedActor);
    const blocks = await this.layers.data.getStreamByName(actor, 'Blocks');
    (0, activitypub_core_types_1.assertIsApType)(blocks, activitypub_core_types_2.AP.CollectionTypes.COLLECTION);
    const blocksId = (0, activitypub_core_utilities_1.getId)(blocks);
    (0, activitypub_core_types_1.assertExists)(blocksId);
    await this.layers.data.insertItem(blocksId, activity.id);
    const followingId = (0, activitypub_core_utilities_1.getId)(actor.following);
    (0, activitypub_core_types_1.assertExists)(followingId);
    const followersId = (0, activitypub_core_utilities_1.getId)(actor.followers);
    (0, activitypub_core_types_1.assertExists)(followersId);
    await Promise.all([
        this.layers.data.removeItem(followingId, blockedActorId),
        this.layers.data.removeItem(followersId, blockedActorId),
    ]);
}
exports.handleBlock = handleBlock;
//# sourceMappingURL=block.js.map