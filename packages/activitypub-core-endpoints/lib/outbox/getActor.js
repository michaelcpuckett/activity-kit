"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActor = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getActor() {
    const url = new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.req.url}`);
    const actor = await this.adapters.db.findOne('entity', {
        outbox: url.toString(),
    });
    if (!actor || !actor.id || !('outbox' in actor)) {
        throw new Error('No actor with this outbox.');
    }
    this.actor = actor;
}
exports.getActor = getActor;
//# sourceMappingURL=getActor.js.map