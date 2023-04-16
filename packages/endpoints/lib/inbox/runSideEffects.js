"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSideEffects = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
async function runSideEffects(recipient) {
    for (const plugin of this.plugins) {
        if (plugin.handleInboxSideEffect) {
            try {
                await plugin.handleInboxSideEffect.call(this, this.activity, recipient);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    try {
        if ((0, utilities_1.isType)(this.activity, types_1.AP.ActivityTypes.CREATE)) {
            await this.handleCreate(this.activity, recipient);
        }
        if ((0, utilities_1.isType)(this.activity, types_1.AP.ActivityTypes.FOLLOW)) {
            await this.handleFollow(this.activity, recipient);
        }
        if ((0, utilities_1.isType)(this.activity, types_1.AP.ActivityTypes.ACCEPT)) {
            await this.handleAccept(this.activity, recipient);
        }
        if ((0, utilities_1.isType)(this.activity, types_1.AP.ActivityTypes.LIKE)) {
            await this.handleLike(this.activity, recipient);
        }
        if ((0, utilities_1.isType)(this.activity, types_1.AP.ActivityTypes.ANNOUNCE)) {
            await this.handleAnnounce(this.activity, recipient);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.runSideEffects = runSideEffects;
//# sourceMappingURL=runSideEffects.js.map