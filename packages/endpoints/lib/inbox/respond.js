"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
async function respond() {
    await this.parseBody();
    (0, types_1.assertExists)(this.activity);
    const activityId = (0, utilities_1.getId)(this.activity);
    if (activityId) {
        const existingActivity = await this.core.findEntityById(activityId);
        if (existingActivity) {
            console.log('We have already received this activity. Assuming it was forwarded by another server.');
            this.res.statusCode = 200;
            this.res.end();
            return;
        }
    }
    for (const actor of await this.getActors()) {
        const isBlocked = await this.isBlocked(actor);
        if (isBlocked) {
            console.log('Blocked from appearing in this inbox.');
            continue;
        }
        await this.core.insertOrderedItem((0, utilities_1.getId)(actor.inbox), activityId);
        await this.runSideEffects(actor);
    }
    await this.core.saveEntity(this.activity);
    await this.broadcastActivity();
    this.res.statusCode = 200;
    this.res.end();
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map