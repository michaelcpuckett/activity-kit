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
exports.handleUndoLike = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleUndoLike(activity) {
    type_utilities_1.assert.isApType(activity, AP.ActivityTypes.LIKE);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.queryById(actorId);
    type_utilities_1.assert.isApActor(actor);
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    const likedId = (0, utilities_1.getId)(actor.liked);
    type_utilities_1.assert.exists(likedId);
    await this.core.removeOrderedItem(likedId, objectId);
    try {
        const object = await this.core.queryById(objectId);
        type_utilities_1.assert.isApExtendedObject(object);
        const likesId = (0, utilities_1.getId)(object.likes);
        type_utilities_1.assert.exists(likesId);
        if (!(0, utilities_1.isLocal)(objectId)) {
            throw new Error('Cannot add to remote collection.');
        }
        await this.core.removeOrderedItem(likesId, activity.id);
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleUndoLike = handleUndoLike;
//# sourceMappingURL=undoLike.js.map