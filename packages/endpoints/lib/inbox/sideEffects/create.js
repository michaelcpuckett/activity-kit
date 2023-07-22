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
exports.handleCreate = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleCreate(activity, recipient) {
    (0, type_utilities_1.assertIsApType)(activity, AP.ActivityTypes.CREATE);
    const objectId = (0, utilities_1.getId)(activity.object);
    (0, type_utilities_1.assertExists)(objectId);
    const existingObject = await this.core.findEntityById(objectId);
    if (existingObject) {
        console.log('We have already received this object.');
        return;
    }
    const object = await this.core.queryById(objectId);
    (0, type_utilities_1.assertIsApEntity)(object);
    await this.core.saveEntity(object);
    try {
        (0, type_utilities_1.assertIsApExtendedObject)(object);
        const inReplyToId = (0, utilities_1.getId)(object.inReplyTo);
        if (!inReplyToId) {
            return;
        }
        (0, type_utilities_1.assertExists)(inReplyToId);
        const inReplyTo = await this.core.findEntityById(inReplyToId);
        (0, type_utilities_1.assertIsApExtendedObject)(inReplyTo);
        const repliesCollectionId = (0, utilities_1.getId)(inReplyTo.replies);
        (0, type_utilities_1.assertExists)(repliesCollectionId);
        const repliesCollection = await this.core.findEntityById(repliesCollectionId);
        (0, type_utilities_1.assertIsApCollection)(repliesCollection);
        const attributedToId = (0, utilities_1.getId)(repliesCollection.attributedTo);
        (0, type_utilities_1.assertExists)(attributedToId);
        console.log(attributedToId.toString(), (0, utilities_1.getId)(recipient)?.toString());
        if (attributedToId.toString() !== (0, utilities_1.getId)(recipient)?.toString()) {
            console.log('Not applicable to this Actor.');
            return;
        }
        await this.core.insertOrderedItem(repliesCollectionId, objectId);
    }
    catch (error) {
        console.log(error);
    }
}
exports.handleCreate = handleCreate;
//# sourceMappingURL=create.js.map