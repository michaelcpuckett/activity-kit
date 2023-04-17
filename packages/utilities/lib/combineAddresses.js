"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineAddresses = void 0;
const types_1 = require("@activity-kit/types");
const getId_1 = require("./getId");
const getArray_1 = require("./getArray");
function combineAddresses(activity) {
    if ('object' in activity) {
        const activityObject = activity.object;
        if ((0, types_1.isTypeOf)(activityObject, types_1.AP.CoreObjectTypes)) {
            const activityTo = (0, getArray_1.getArray)(activity.to);
            const activityCc = (0, getArray_1.getArray)(activity.cc);
            const activityBto = (0, getArray_1.getArray)(activity.bto);
            const activityBcc = (0, getArray_1.getArray)(activity.bcc);
            const activityAudience = (0, getArray_1.getArray)(activity.audience);
            const objectTo = (0, getArray_1.getArray)(activityObject.to);
            const objectCc = (0, getArray_1.getArray)(activityObject.cc);
            const objectBto = (0, getArray_1.getArray)(activityObject.bto);
            const objectBcc = (0, getArray_1.getArray)(activityObject.bcc);
            const objectAudience = (0, getArray_1.getArray)(activityObject.audience);
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