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
exports.handleUndo = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleUndo(activity) {
    type_utilities_1.assert.isApType(activity, AP.ActivityTypes.UNDO);
    const objectId = (0, utilities_1.getId)(activity.object);
    const object = await this.core.findEntityById(objectId);
    type_utilities_1.assert.isApActivity(object);
    if (!isActorAuthorizedToModifyObject(this.actor, activity)) {
        throw new Error('Not authorized to modify object!');
    }
    if (type_utilities_1.guard.isType(object, AP.ActivityTypes.CREATE)) {
        await this.handleDelete(object);
    }
    if (type_utilities_1.guard.isType(object, AP.ActivityTypes.FOLLOW)) {
        await this.handleUndoFollow(object);
    }
    if (type_utilities_1.guard.isType(object, AP.ActivityTypes.ACCEPT)) {
        await this.handleUndoAccept(object);
    }
    if (type_utilities_1.guard.isType(object, AP.ActivityTypes.BLOCK)) {
        await this.handleUndoBlock(object);
    }
    if (type_utilities_1.guard.isType(object, AP.ActivityTypes.LIKE)) {
        await this.handleUndoLike(object);
    }
    if (type_utilities_1.guard.isType(object, AP.ActivityTypes.ANNOUNCE)) {
        await this.handleUndoAnnounce(object);
    }
    if (type_utilities_1.guard.isType(object, AP.ActivityTypes.ADD)) {
        await this.handleRemove(object);
    }
    if (type_utilities_1.guard.isType(object, AP.ActivityTypes.REMOVE)) {
        await this.handleAdd(object);
    }
}
exports.handleUndo = handleUndo;
function isActorAuthorizedToModifyObject(initiator, activity) {
    const initiatorId = (0, utilities_1.getId)(initiator);
    if (!initiatorId) {
        return false;
    }
    if (Array.isArray(activity.attributedTo) &&
        activity.attributedTo.find((reference) => {
            const id = (0, utilities_1.getId)(reference);
            if (id && id.toString() === initiatorId.toString()) {
                return true;
            }
        })) {
        return true;
    }
    const activityActorId = (0, utilities_1.getId)(activity.actor);
    const activityActorAttributedTo = (0, utilities_1.getId)(activity.attributedTo);
    if (activityActorId?.toString() === initiatorId.toString()) {
        return true;
    }
    if (activityActorAttributedTo?.toString() === initiatorId.toString()) {
        return true;
    }
}
//# sourceMappingURL=index.js.map