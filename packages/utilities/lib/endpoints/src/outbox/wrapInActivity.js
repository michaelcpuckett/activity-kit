"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapInActivity = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
const path_to_regexp_1 = require("path-to-regexp");
async function wrapInActivity(body) {
    this.activity = (0, utilities_1.combineAddresses)({
        type: types_1.AP.ActivityTypes.CREATE,
        actor: this.actor.id,
        object: body,
    });
    const [type] = (0, utilities_1.getArray)(this.activity.type);
    const activityId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes[type.toLowerCase()], {
        encode: encodeURIComponent,
    })({
        guid: await this.core.getGuid(),
    })}`);
    this.activity.id = activityId;
    this.activity.url = activityId;
    await this.handleCreate(this.activity);
}
exports.wrapInActivity = wrapInActivity;
//# sourceMappingURL=wrapInActivity.js.map