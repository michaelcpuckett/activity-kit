"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldForwardActivity = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function shouldForwardActivity() {
    if (!this.activity) {
        return false;
    }
    if (!(0, activitypub_core_utilities_1.isTypeOf)(this.activity, activitypub_core_types_1.AP.ActivityTypes)) {
        return false;
    }
    const activity = this.activity;
    const to = activity.to
        ? Array.isArray(activity.to)
            ? activity.to
            : [activity.to]
        : [];
    const cc = activity.cc
        ? Array.isArray(activity.cc)
            ? activity.cc
            : [activity.cc]
        : [];
    const audience = activity.audience
        ? Array.isArray(activity.audience)
            ? activity.audience
            : [activity.audience]
        : [];
    const addressees = [...to, ...cc, ...audience];
    for (const addressee of addressees) {
        const addresseeId = (0, activitypub_core_utilities_1.getId)(addressee);
        if (!addresseeId) {
            continue;
        }
        const foundItem = await this.databaseService.findEntityById(addresseeId);
        if (!foundItem) {
            continue;
        }
        if (foundItem.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION ||
            foundItem.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION ||
            (Array.isArray(foundItem.type) &&
                (foundItem.type.includes(activitypub_core_types_1.AP.CollectionTypes.COLLECTION) ||
                    foundItem.type.includes(activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)))) {
            return true;
        }
    }
    const inReplyTo = activity.to
        ? Array.isArray(activity.inReplyTo)
            ? activity.inReplyTo
            : [activity.inReplyTo]
        : [];
    const object = 'object' in activity && activity.object
        ? Array.isArray(activity.object)
            ? activity.object
            : [activity.object]
        : [];
    const target = activity.target
        ? Array.isArray(activity.target)
            ? activity.target
            : [activity.target]
        : [];
    const tag = activity.tag
        ? Array.isArray(activity.tag)
            ? activity.tag
            : [activity.tag]
        : [];
    const objects = [...inReplyTo, ...object, ...target, ...tag];
    for (const object of objects) {
        const objectId = (0, activitypub_core_utilities_1.getId)(object);
        if (!objectId) {
            continue;
        }
        if (objectId.toString() === this.actor?.id?.toString()) {
            continue;
        }
        const foundItem = await this.databaseService.findEntityById(objectId);
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