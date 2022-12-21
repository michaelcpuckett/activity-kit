"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSideEffects = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function runSideEffects() {
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.CREATE)) {
        await this.handleCreate();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.DELETE)) {
        await this.handleDelete();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.ACCEPT)) {
        await this.handleAccept();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.BLOCK)) {
        await this.handleBlock();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.UPDATE)) {
        await this.handleUpdate();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.LIKE)) {
        await this.handleLike();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE)) {
        await this.handleAnnounce();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.ADD)) {
        await this.handleAdd();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.REMOVE)) {
        await this.handleRemove();
    }
    if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.UNDO)) {
        await this.handleUndo();
    }
    for (const plugin of this.plugins) {
        if (plugin.handleOutboxSideEffect) {
            await plugin.handleOutboxSideEffect.call(this);
        }
    }
}
exports.runSideEffects = runSideEffects;
//# sourceMappingURL=runSideEffects.js.map