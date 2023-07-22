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
exports.handleAnnounce = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const AP = __importStar(require("@activity-kit/types"));
const utilities_1 = require("@activity-kit/utilities");
async function handleAnnounce(activity, recipient) {
    (0, type_utilities_1.assertIsApType)(activity, AP.ActivityTypes.ANNOUNCE);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, type_utilities_1.assertExists)(objectId);
    const object = await this.core.findEntityById(objectId);
    try {
        (0, type_utilities_1.assertIsApExtendedObject)(object);
        const sharesId = (0, utilities_1.getId)(object.shares);
        const shares = await this.core.findEntityById(sharesId);
        (0, type_utilities_1.assertIsApCollection)(shares);
        const attributedToId = (0, utilities_1.getId)(shares.attributedTo);
        (0, type_utilities_1.assertExists)(attributedToId);
        if (attributedToId.toString() !== (0, utilities_1.getId)(recipient)?.toString()) {
            return;
        }
        if (Array.isArray(shares.type)
            ? shares.type.includes(AP.CollectionTypes.COLLECTION)
            : shares.type === AP.CollectionTypes.COLLECTION) {
            await this.core.insertItem(sharesId, activity.id);
        }
        else if (Array.isArray(shares.type)
            ? shares.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
            : shares.type === AP.CollectionTypes.ORDERED_COLLECTION) {
            await this.core.insertOrderedItem(sharesId, activity.id);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map