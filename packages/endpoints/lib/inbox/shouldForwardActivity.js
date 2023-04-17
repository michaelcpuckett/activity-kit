"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldForwardActivity = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function shouldForwardActivity() {
    if (!this.activity) {
        return false;
    }
    if (!(0, types_1.isTypeOf)(this.activity, types_1.AP.ActivityTypes)) {
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
        if ((0, types_1.isType)(foundItem, types_1.AP.CollectionTypes.COLLECTION) ||
            (0, types_1.isType)(foundItem, types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
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