"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPublic = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function isPublic(activity) {
    if (activity.to) {
        const addressees = Array.isArray(activity.to) ? activity.to : [activity.to];
        const isFound = addressees.find((recipient) => recipient.toString() === activitypub_core_utilities_1.PUBLIC_ACTOR);
        if (isFound) {
            return true;
        }
    }
    if (activity.cc) {
        const addressees = Array.isArray(activity.cc) ? activity.cc : [activity.cc];
        const isFound = addressees.find((recipient) => recipient.toString() === activitypub_core_utilities_1.PUBLIC_ACTOR);
        if (isFound) {
            return true;
        }
    }
    if (activity.bto) {
        const addressees = Array.isArray(activity.bto)
            ? activity.bto
            : [activity.bto];
        const isFound = addressees.find((recipient) => recipient.toString() === activitypub_core_utilities_1.PUBLIC_ACTOR);
        if (isFound) {
            return true;
        }
    }
    if (activity.bcc) {
        const addressees = Array.isArray(activity.bcc)
            ? activity.bcc
            : [activity.bcc];
        const isFound = addressees.find((recipient) => recipient.toString() === activitypub_core_utilities_1.PUBLIC_ACTOR);
        if (isFound) {
            return true;
        }
    }
    if (activity.audience) {
        const addressees = Array.isArray(activity.audience)
            ? activity.audience
            : [activity.audience];
        const isFound = addressees.find((recipient) => recipient.toString() === activitypub_core_utilities_1.PUBLIC_ACTOR);
        if (isFound) {
            return true;
        }
    }
    return false;
}
exports.isPublic = isPublic;
//# sourceMappingURL=isPublic.js.map