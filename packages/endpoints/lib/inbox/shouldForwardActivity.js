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
exports.shouldForwardActivity = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function shouldForwardActivity() {
    if (!this.activity) {
        return false;
    }
    if (!type_utilities_1.guard.isTypeOf(this.activity, AP.ActivityTypes)) {
        return false;
    }
    const activity = this.activity;
    const to = (0, utilities_1.getArray)(activity.to);
    const cc = (0, utilities_1.getArray)(activity.cc);
    const audience = (0, utilities_1.getArray)(activity.audience);
    const addressees = [...to, ...cc, ...audience];
    for (const addressee of addressees) {
        const addresseeId = (0, utilities_1.getId)(addressee);
        if (!addresseeId) {
            continue;
        }
        const foundItem = await this.core.findEntityById(addresseeId);
        if (!foundItem) {
            continue;
        }
        if (type_utilities_1.guard.isApType(foundItem, AP.CollectionTypes.COLLECTION) ||
            type_utilities_1.guard.isApType(foundItem, AP.CollectionTypes.ORDERED_COLLECTION)) {
            return true;
        }
    }
    const inReplyTo = (0, utilities_1.getArray)(activity.inReplyTo);
    const object = 'object' in activity ? (0, utilities_1.getArray)(activity.object) : [];
    const target = 'target' in activity ? (0, utilities_1.getArray)(activity.target) : [];
    const tag = (0, utilities_1.getArray)(activity.tag);
    const objects = [...inReplyTo, ...object, ...target, ...tag];
    for (const object of objects) {
        const objectId = (0, utilities_1.getId)(object);
        if (!objectId) {
            continue;
        }
        const foundItem = await this.core.findEntityById(objectId);
        if (!foundItem) {
            continue;
        }
        if (foundItem) {
            return true;
        }
    }
}
exports.shouldForwardActivity = shouldForwardActivity;
//# sourceMappingURL=shouldForwardActivity.js.map