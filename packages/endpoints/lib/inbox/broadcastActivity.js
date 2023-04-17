"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastActivity = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function broadcastActivity() {
    if (!this.activity) {
        throw new Error('No activity.');
    }
    const botActor = await this.core.findOne('entity', {
        preferredUsername: utilities_1.SERVER_ACTOR_USERNAME,
    });
    (0, types_1.assertIsApActor)(botActor);
    if (await this.shouldForwardActivity()) {
        if ((0, types_1.isTypeOf)(this.activity, types_1.AP.ActivityTypes)) {
            await this.core.broadcast(this.activity, botActor);
        }
    }
}
exports.broadcastActivity = broadcastActivity;
//# sourceMappingURL=broadcastActivity.js.map