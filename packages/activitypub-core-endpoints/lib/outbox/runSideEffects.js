"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSideEffects = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function runSideEffects() {
    for (const plugin of this.plugins) {
        if (plugin.handleOutboxSideEffect) {
            try {
                await plugin.handleOutboxSideEffect.call(this);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    try {
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.CREATE)) {
            await this.handleCreate(this.activity);
        }
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.DELETE)) {
            await this.handleDelete(this.activity);
        }
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.ACCEPT)) {
            await this.handleAccept(this.activity);
        }
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.BLOCK)) {
            await this.handleBlock(this.activity);
        }
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.UPDATE)) {
            await this.handleUpdate(this.activity);
        }
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.LIKE)) {
            await this.handleLike(this.activity);
        }
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE)) {
            await this.handleAnnounce(this.activity);
        }
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.ADD)) {
            await this.handleAdd(this.activity);
        }
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.REMOVE)) {
            await this.handleRemove(this.activity);
        }
        if ((0, activitypub_core_utilities_1.isType)(this.activity, activitypub_core_types_1.AP.ActivityTypes.UNDO)) {
            await this.handleUndo(this.activity);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.runSideEffects = runSideEffects;
//# sourceMappingURL=runSideEffects.js.map