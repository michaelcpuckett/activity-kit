"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapInActivity = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
const path_to_regexp_1 = require("path-to-regexp");
async function wrapInActivity() {
    this.activity = (0, activitypub_core_utilities_1.combineAddresses)({
        type: activitypub_core_types_1.AP.ActivityTypes.CREATE,
        actor: this.actor.id,
        object: this.activity,
    });
    const compileOptions = { encode: encodeURIComponent };
    const type = Array.isArray(this.activity.type)
        ? this.activity.type[0]
        : this.activity.type;
    const activityId = new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes[type.toLowerCase()], compileOptions)({
        guid: (0, activitypub_core_utilities_1.getGuid)(),
    })}`);
    this.activity.id = activityId;
    this.activity.url = activityId;
    await this.handleCreate(this.activity);
}
exports.wrapInActivity = wrapInActivity;
//# sourceMappingURL=wrapInActivity.js.map