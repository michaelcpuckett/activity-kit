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
exports.combineAddresses = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
function combineAddresses(activity) {
    if ('object' in activity) {
        const activityObject = activity.object;
        if ((0, type_utilities_1.isTypeOf)(activityObject, AP.CoreObjectTypes)) {
            const activityTo = (0, utilities_1.getArray)(activity.to);
            const activityCc = (0, utilities_1.getArray)(activity.cc);
            const activityBto = (0, utilities_1.getArray)(activity.bto);
            const activityBcc = (0, utilities_1.getArray)(activity.bcc);
            const activityAudience = (0, utilities_1.getArray)(activity.audience);
            const objectTo = (0, utilities_1.getArray)(activityObject.to);
            const objectCc = (0, utilities_1.getArray)(activityObject.cc);
            const objectBto = (0, utilities_1.getArray)(activityObject.bto);
            const objectBcc = (0, utilities_1.getArray)(activityObject.bcc);
            const objectAudience = (0, utilities_1.getArray)(activityObject.audience);
            const to = [...new Set([...activityTo, ...objectTo].map(utilities_1.getId))].filter((item) => !!item);
            const bto = [
                ...new Set([...activityBto, ...objectBto].map(utilities_1.getId)),
            ].filter((item) => !!item);
            const cc = [...new Set([...activityCc, ...objectCc].map(utilities_1.getId))].filter((item) => !!item);
            const bcc = [
                ...new Set([...activityBcc, ...objectBcc].map(utilities_1.getId)),
            ].filter((item) => !!item);
            const audience = [
                ...new Set([...activityAudience, ...objectAudience].map(utilities_1.getId)),
            ].filter((item) => !!item);
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