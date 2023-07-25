"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBlock = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleBlock(activity) {
    const actorId = (0, utilities_1.getId)(activity.actor);
    type_utilities_1.assert.exists(actorId);
    const actor = await this.core.queryById(actorId);
    type_utilities_1.assert.isApActor(actor);
    const blockedActorId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(blockedActorId);
    const blockedActor = await this.core.queryById(blockedActorId);
    type_utilities_1.assert.isApActor(blockedActor);
    const blocks = await this.core.getStreamByName(actor, 'Blocks');
    type_utilities_1.assert.isApType(blocks, AP.CollectionTypes.COLLECTION);
    const blocksId = (0, utilities_1.getId)(blocks);
    type_utilities_1.assert.exists(blocksId);
    const activityId = (0, utilities_1.getId)(activity);
    type_utilities_1.assert.exists(activityId);
    await this.core.insertItem(blocksId, activityId);
    const followingId = (0, utilities_1.getId)(actor.following);
    type_utilities_1.assert.exists(followingId);
    const followersId = (0, utilities_1.getId)(actor.followers);
    type_utilities_1.assert.exists(followersId);
    await Promise.all([
        this.core.removeItem(followingId, blockedActorId),
        this.core.removeItem(followersId, blockedActorId),
    ]);
}
exports.handleBlock = handleBlock;
//# sourceMappingURL=block.js.map