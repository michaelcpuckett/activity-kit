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
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleAnnounce(activity, recipient) {
    try {
        const objectId = (0, utilities_1.getId)(activity.object);
        type_utilities_1.assert.exists(objectId);
        const object = await this.core.findEntityById(objectId);
        type_utilities_1.assert.isApExtendedObject(object);
        const sharesId = (0, utilities_1.getId)(object.shares);
        type_utilities_1.assert.exists(sharesId);
        const shares = await this.core.findEntityById(sharesId);
        type_utilities_1.assert.isApCollection(shares);
        const attributedToId = (0, utilities_1.getId)(shares.attributedTo);
        type_utilities_1.assert.exists(attributedToId);
        if (attributedToId.href !== (0, utilities_1.getId)(recipient)?.href) {
            // Not applicable to this Actor.
            return;
        }
        const activityId = (0, utilities_1.getId)(activity);
        type_utilities_1.assert.exists(activityId);
        if (type_utilities_1.guard.isApType(shares, AP.CollectionTypes.ORDERED_COLLECTION)) {
            await this.core.insertOrderedItem(sharesId, activityId);
        }
        else {
            await this.core.insertItem(sharesId, activityId);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map