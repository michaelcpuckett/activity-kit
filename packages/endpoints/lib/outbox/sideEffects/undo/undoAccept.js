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
exports.handleUndoAccept = void 0;
const utilities_1 = require("@activity-kit/utilities");
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
async function handleUndoAccept(activity) {
    type_utilities_1.assert.isApType(activity, AP.ActivityTypes.ACCEPT);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.findEntityById(actorId);
    type_utilities_1.assert.isApActor(actor);
    const followersId = (0, utilities_1.getId)(actor.followers);
    type_utilities_1.assert.exists(followersId);
    const followId = (0, utilities_1.getId)(activity.object);
    const follow = await this.core.queryById(followId);
    type_utilities_1.assert.isApType(follow, AP.ActivityTypes.FOLLOW);
    const followerId = (0, utilities_1.getId)(follow.actor);
    type_utilities_1.assert.exists(followerId);
    await this.core.removeItem(followersId, followerId);
}
exports.handleUndoAccept = handleUndoAccept;
//# sourceMappingURL=undoAccept.js.map