"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastActivity = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function broadcastActivity() {
    type_utilities_1.assert.isApActivity(this.activity);
    const botActor = await this.core.findOne('entity', {
        preferredUsername: utilities_1.SERVER_ACTOR_USERNAME,
    });
    type_utilities_1.assert.isApActor(botActor);
    if (await this.shouldForwardActivity()) {
        await this.core.broadcast(this.activity, botActor);
    }
}
exports.broadcastActivity = broadcastActivity;
//# sourceMappingURL=broadcastActivity.js.map