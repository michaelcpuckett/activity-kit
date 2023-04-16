"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBlock = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const types_2 = require("@activity-kit/types");
async function handleBlock(activity) {
    (0, types_1.assertIsApType)(activity, types_2.AP.ActivityTypes.BLOCK);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.queryById(actorId);
    (0, types_1.assertIsApActor)(actor);
    const blockedActorId = (0, utilities_1.getId)(activity.object);
    const blockedActor = await this.core.queryById(blockedActorId);
    (0, types_1.assertIsApActor)(blockedActor);
    const blocks = await this.core.getStreamByName(actor, 'Blocks');
    (0, types_1.assertIsApType)(blocks, types_2.AP.CollectionTypes.COLLECTION);
    const blocksId = (0, utilities_1.getId)(blocks);
    (0, types_1.assertExists)(blocksId);
    await this.core.insertItem(blocksId, activity.id);
    const followingId = (0, utilities_1.getId)(actor.following);
    (0, types_1.assertExists)(followingId);
    const followersId = (0, utilities_1.getId)(actor.followers);
    (0, types_1.assertExists)(followersId);
    await Promise.all([
        this.core.removeItem(followingId, blockedActorId),
        this.core.removeItem(followersId, blockedActorId),
    ]);
}
exports.handleBlock = handleBlock;
//# sourceMappingURL=block.js.map