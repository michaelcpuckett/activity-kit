"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastActivity = void 0;
async function broadcastActivity() {
    if (!this.activity) {
        throw new Error('No activity.');
    }
    const botActor = (await this.adapters.db.findOne('entity', {
        preferredUsername: 'bot',
    }));
    if (!botActor) {
        throw new Error('Bot actor not set up.');
    }
    if (await this.shouldForwardActivity()) {
        await this.adapters.delivery.broadcast(this.activity, botActor);
    }
}
exports.broadcastActivity = broadcastActivity;
//# sourceMappingURL=broadcastActivity.js.map