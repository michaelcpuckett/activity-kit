"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const utilities_1 = require("@activity-kit/utilities");
const type_utilities_1 = require("@activity-kit/type-utilities");
async function respond() {
    type_utilities_1.assert.exists(this.activity);
    const activityId = (0, utilities_1.getId)(this.activity);
    if (!activityId) {
        throw new Error('Activities without an ID are not supported yet.');
    }
    const existingActivity = await this.core.findEntityById(activityId);
    if (existingActivity) {
        console.log('We have already received this activity. Assuming it was forwarded by another server.');
        return {
            statusCode: 200,
        };
    }
    for (const actor of await this.getActors()) {
        const isBlocked = await this.isBlocked(actor);
        if (isBlocked) {
            console.log('Blocked from appearing in this inbox.');
            continue;
        }
        const actorInboxId = (0, utilities_1.getId)(actor.inbox);
        type_utilities_1.assert.exists(actorInboxId);
        await this.core.insertOrderedItem(actorInboxId, activityId);
        await this.runSideEffects(actor);
    }
    await this.core.saveEntity(this.activity);
    await this.broadcastActivity();
    return {
        statusCode: 200,
    };
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map