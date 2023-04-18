"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapInActivity = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
const path_to_regexp_1 = require("path-to-regexp");
async function wrapInActivity(body) {
    const id = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.create, {
        encode: encodeURIComponent,
    })({
        guid: await this.core.getGuid(),
    })}`);
    return (0, utilities_1.applyContext)(this.combineAddresses({
        id,
        url: id,
        type: types_1.AP.ActivityTypes.CREATE,
        actor: this.actor.id,
        object: body,
    }));
}
exports.wrapInActivity = wrapInActivity;
//# sourceMappingURL=wrapInActivity.js.map