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
    (0, type_utilities_1.assertIsApType)(activity, AP.ActivityTypes.BLOCK);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.queryById(actorId);
    (0, type_utilities_1.assertIsApActor)(actor);
    const blockedActorId = (0, utilities_1.getId)(activity.object);
    const blockedActor = await this.core.queryById(blockedActorId);
    (0, type_utilities_1.assertIsApActor)(blockedActor);
    const blocks = await this.core.getStreamByName(actor, 'Blocks');
    (0, type_utilities_1.assertIsApType)(blocks, AP.CollectionTypes.COLLECTION);
    const blocksId = (0, utilities_1.getId)(blocks);
    (0, type_utilities_1.assertExists)(blocksId);
    await this.core.insertItem(blocksId, activity.id);
    const followingId = (0, utilities_1.getId)(actor.following);
    (0, type_utilities_1.assertExists)(followingId);
    const followersId = (0, utilities_1.getId)(actor.followers);
    (0, type_utilities_1.assertExists)(followersId);
    await Promise.all([
        this.core.removeItem(followingId, blockedActorId),
        this.core.removeItem(followersId, blockedActorId),
    ]);
}
exports.handleBlock = handleBlock;
//# sourceMappingURL=block.js.map