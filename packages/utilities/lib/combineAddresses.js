"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineAddresses = void 0;
const types_1 = require("@activity-kit/types");
const getId_1 = require("./getId");
const isType_1 = require("./isType");
function combineAddresses(activity) {
    if ((0, isType_1.isType)(activity, types_1.AP.ActivityTypes.CREATE) &&
        'object' in activity &&
        activity.object &&
        'type' in activity.object) {
        const activityObject = activity.object;
        if ((0, isType_1.isTypeOf)(activityObject, types_1.AP.CoreObjectTypes)) {
            const activityTo = Array.isArray(activity.to)
                ? activity.to
                : activity.to
                    ? [activity.to]
                    : [];
            const activityCc = Array.isArray(activity.cc)
                ? activity.cc
                : activity.cc
                    ? [activity.cc]
                    : [];
            const activityBto = Array.isArray(activity.bto)
                ? activity.bto
                : activity.bto
                    ? [activity.bto]
                    : [];
            const activityBcc = Array.isArray(activity.bcc)
                ? activity.bcc
                : activity.bcc
                    ? [activity.bcc]
                    : [];
            const activityAudience = Array.isArray(activity.audience)
                ? activity.audience
                : activity.audience
                    ? [activity.audience]
                    : [];
            const objectTo = Array.isArray(activityObject.to)
                ? activityObject.to
                : activityObject.to
                    ? [activityObject.to]
                    : [];
            const objectCc = Array.isArray(activityObject.cc)
                ? activityObject.cc
                : activityObject.cc
                    ? [activityObject.cc]
                    : [];
            const objectBto = Array.isArray(activityObject.bto)
                ? activityObject.bto
                : activityObject.bto
                    ? [activityObject.bto]
                    : [];
            const objectBcc = Array.isArray(activityObject.bcc)
                ? activityObject.bcc
                : activityObject.bcc
                    ? [activityObject.bcc]
                    : [];
            const objectAudience = Array.isArray(activityObject.audience)
                ? activityObject.audience
                    ? activityObject.audience
                    : [activityObject.audience]
                : [];
            const to = [...new Set([...activityTo, ...objectTo].map(getId_1.getId))].filter((item) => item);
            const bto = [
                ...new Set([...activityBto, ...objectBto].map(getId_1.getId)),
            ].filter((item) => item);
            const cc = [...new Set([...activityCc, ...objectCc].map(getId_1.getId))].filter((item) => item);
            const bcc = [
                ...new Set([...activityBcc, ...objectBcc].map(getId_1.getId)),
            ].filter((item) => item);
            const audience = [
                ...new Set([...activityAudience, ...objectAudience].map(getId_1.getId)),
            ].filter((item) => item);
            activity.to = to;
            activity.bto = bto;
            activity.cc = cc;
            activity.bcc = bcc;
            activity.audience = audience;
            activityObject.to = to;
            activityObject.bto = bto;
            activityObject.cc = cc;
            activityObject.bcc = bcc;
            activityObject.audience = audience;
            activity.object = activityObject;
        }
    }
    return activity;
}
exports.combineAddresses = combineAddresses;
//# sourceMappingURL=combineAddresses.js.map