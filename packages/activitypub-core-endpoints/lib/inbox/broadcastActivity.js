"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastActivity = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function broadcastActivity() {
    if (!this.activity) {
        throw new Error('No activity.');
    }
    const botActor = await this.lib.findOne('entity', {
        preferredUsername: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
    });
    (0, activitypub_core_types_1.assertIsApActor)(botActor);
    if (await this.shouldForwardActivity()) {
        await this.lib.broadcast(this.activity, botActor);
    }
}
exports.broadcastActivity = broadcastActivity;
//# sourceMappingURL=broadcastActivity.js.map