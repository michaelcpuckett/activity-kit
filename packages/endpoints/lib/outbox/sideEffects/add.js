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
exports.handleAdd = void 0;
const AP = __importStar(require("@activity-kit/types"));
const utilities_1 = require("@activity-kit/utilities");
const type_utilities_1 = require("@activity-kit/type-utilities");
async function handleAdd(activity) {
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    const targetId = (0, utilities_1.getId)(activity.target);
    type_utilities_1.assert.exists(targetId);
    const target = await this.core.findEntityById(targetId);
    type_utilities_1.assert.isApCollection(target);
    if (target.attributedTo) {
        const actorId = (0, utilities_1.getId)(activity.actor);
        type_utilities_1.assert.exists(actorId);
        const attributedToId = (0, utilities_1.getId)(target.attributedTo);
        type_utilities_1.assert.exists(attributedToId);
        if (attributedToId.href !== actorId.href) {
            throw new Error('Not allowed.');
        }
    }
    if (type_utilities_1.guard.isApType(target, AP.CollectionTypes.ORDERED_COLLECTION)) {
        await this.core.insertOrderedItem(targetId, objectId);
    }
    else {
        await this.core.insertItem(targetId, objectId);
    }
}
exports.handleAdd = handleAdd;
//# sourceMappingURL=add.js.map