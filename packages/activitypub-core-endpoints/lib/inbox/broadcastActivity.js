"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastActivity = void 0;
async function broadcastActivity() {
    if (!this.activity) {
        throw new Error('No activity.');
    }
    if (!this.actor) {
        throw new Error('No actor.');
    }
    if (await this.shouldForwardActivity()) {
        await this.adapters.delivery.broadcast(this.activity, this.actor);
    }
}
exports.broadcastActivity = broadcastActivity;
//# sourceMappingURL=broadcastActivity.js.map