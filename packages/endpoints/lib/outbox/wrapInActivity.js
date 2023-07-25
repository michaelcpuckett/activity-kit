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
exports.wrapInActivity = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function wrapInActivity(body) {
    const id = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.create, {
        encode: encodeURIComponent,
    })({
        guid: await this.core.getGuid(),
    })}`);
    const actorId = (0, utilities_1.getId)(this.actor);
    type_utilities_1.assert.exists(actorId);
    return (0, utilities_1.applyContext)(this.combineAddresses({
        id,
        url: id,
        type: AP.ActivityTypes.CREATE,
        actor: actorId,
        object: body,
    }));
}
exports.wrapInActivity = wrapInActivity;
//# sourceMappingURL=wrapInActivity.js.map