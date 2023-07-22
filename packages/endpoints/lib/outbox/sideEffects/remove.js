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
exports.handleRemove = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleRemove(activity) {
    (0, type_utilities_1.assertIsApType)(activity, AP.ActivityTypes.REMOVE);
    const objectId = (0, utilities_1.getId)(activity.object);
    const targetId = (0, utilities_1.getId)(activity.target);
    const target = await this.core.findEntityById(targetId);
    (0, type_utilities_1.assertIsApCollection)(target);
    if (target.attributedTo) {
        const actorId = (0, utilities_1.getId)(activity.actor);
        const attributedToId = (0, utilities_1.getId)(target.attributedTo);
        if (attributedToId?.toString() !== actorId?.toString()) {
            throw new Error('Not allowed.');
        }
    }
    if (Array.isArray(target.type)
        ? target.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
        : target.type === AP.CollectionTypes.ORDERED_COLLECTION) {
        await this.core.removeOrderedItem(targetId, objectId);
    }
    else if (Array.isArray(target.type)
        ? target.type.includes(AP.CollectionTypes.COLLECTION)
        : target.type === AP.CollectionTypes.COLLECTION) {
        await this.core.removeItem(targetId, objectId);
    }
    else {
        throw new Error('Bad target: Not a collection.');
    }
}
exports.handleRemove = handleRemove;
//# sourceMappingURL=remove.js.map