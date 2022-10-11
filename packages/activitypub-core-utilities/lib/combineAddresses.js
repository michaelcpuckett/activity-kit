"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineAddresses = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const getId_1 = require("./getId");
function combineAddresses(activity) {
    if (activity.type === activitypub_core_types_1.AP.ActivityTypes.CREATE &&
        'object' in activity &&
        activity.object &&
        'type' in activity.object) {
        for (const type of Object.values(activitypub_core_types_1.AP.CoreObjectTypes)) {
            if (type === activity.object.type) {
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
                const objectTo = Array.isArray(activity.object.to)
                    ? activity.object.to
                    : activity.object.to
                        ? [activity.object.to]
                        : [];
                const objectCc = Array.isArray(activity.object.cc)
                    ? activity.object.cc
                    : activity.object.cc
                        ? [activity.object.cc]
                        : [];
                const objectBto = Array.isArray(activity.object.bto)
                    ? activity.object.bto
                    : activity.object.bto
                        ? [activity.object.bto]
                        : [];
                const objectBcc = Array.isArray(activity.object.bcc)
                    ? activity.object.bcc
                    : activity.object.bcc
                        ? [activity.object.bcc]
                        : [];
                const objectAudience = Array.isArray(activity.object.audience)
                    ? activity.object.audience
                        ? activity.object.audience
                        : [activity.object.audience]
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
                activity.object.to = to;
                activity.object.bto = bto;
                activity.object.cc = cc;
                activity.object.bcc = bcc;
                activity.object.audience = audience;
            }
        }
    }
    return activity;
}
exports.combineAddresses = combineAddresses;
//# sourceMappingURL=combineAddresses.js.map