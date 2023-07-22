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
exports.handleLike = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleLike(activity, recipient) {
    (0, type_utilities_1.assertIsApType)(activity, AP.ActivityTypes.LIKE);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, type_utilities_1.assertExists)(objectId);
    const object = await this.core.findEntityById(objectId);
    (0, type_utilities_1.assertIsApEntity)(object);
    try {
        (0, type_utilities_1.assertIsApExtendedObject)(object);
        const likesId = (0, utilities_1.getId)(object.likes);
        (0, type_utilities_1.assertExists)(likesId);
        const likes = await this.core.findEntityById(likesId);
        (0, type_utilities_1.assertIsApCollection)(likes);
        const attributedToId = (0, utilities_1.getId)(likes.attributedTo);
        (0, type_utilities_1.assertExists)(attributedToId);
        if (attributedToId.toString() !== (0, utilities_1.getId)(recipient)?.toString()) {
            return;
        }
        if (Array.isArray(likes.type)
            ? likes.type.includes(AP.CollectionTypes.COLLECTION)
            : likes.type === AP.CollectionTypes.COLLECTION) {
            await this.core.insertItem(likesId, activity.id);
        }
        else if (Array.isArray(likes.type)
            ? likes.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
            : likes.type === AP.CollectionTypes.ORDERED_COLLECTION) {
            await this.core.insertOrderedItem(likesId, activity.id);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleLike = handleLike;
//# sourceMappingURL=like.js.map