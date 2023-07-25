"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineAddresses = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
function combineAddresses(activity) {
    type_utilities_1.assert.isApTransitiveActivity(activity);
    type_utilities_1.assert.isApCoreObject(activity.object);
    const getArrayOfIds = (item) => (0, utilities_1.getArray)(item).map(utilities_1.getId).filter(type_utilities_1.guard.isUrl);
    const activityTo = getArrayOfIds(activity.to);
    const activityCc = getArrayOfIds(activity.cc);
    const activityBto = getArrayOfIds(activity.bto);
    const activityBcc = getArrayOfIds(activity.bcc);
    const activityAudience = getArrayOfIds(activity.audience);
    const objectTo = getArrayOfIds(activity.object.to);
    const objectCc = getArrayOfIds(activity.object.cc);
    const objectBto = getArrayOfIds(activity.object.bto);
    const objectBcc = getArrayOfIds(activity.object.bcc);
    const objectAudience = getArrayOfIds(activity.object.audience);
    const to = [...new Set([...activityTo, ...objectTo])];
    const bto = [...new Set([...activityBto, ...objectBto])];
    const cc = [...new Set([...activityCc, ...objectCc])];
    const bcc = [...new Set([...activityBcc, ...objectBcc])];
    const audience = [...new Set([...activityAudience, ...objectAudience])];
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
    return activity;
}
exports.combineAddresses = combineAddresses;
//# sourceMappingURL=combineAddresses.js.map