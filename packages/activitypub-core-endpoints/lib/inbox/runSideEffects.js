"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSideEffects = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
async function runSideEffects() {
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.CREATE)) {
        await this.handleCreate();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.FOLLOW)) {
        await this.handleFollow();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.ACCEPT)) {
        await this.handleAccept();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.LIKE)) {
        await this.handleLike();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE)) {
        await this.handleAnnounce();
    }
}
exports.runSideEffects = runSideEffects;
//# sourceMappingURL=runSideEffects.js.map