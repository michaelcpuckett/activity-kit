"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActor = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getActor() {
    const url = `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.req.url}`;
    const actor = await this.databaseService.findOne('actor', {
        inbox: url,
    });
    if (!actor || !actor.id || !('inbox' in actor)) {
        throw new Error('No actor with this inbox.');
    }
    this.actor = actor;
}
exports.getActor = getActor;
//# sourceMappingURL=getActor.js.map