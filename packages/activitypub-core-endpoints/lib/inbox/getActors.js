"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getActors() {
    const url = `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.req.url}`;
    const actor = await this.adapters.db.findOne('entity', {
        inbox: url,
    });
    if (!actor || !actor.id || !('inbox' in actor)) {
        throw new Error('No actor with this inbox.');
    }
    this.actors = [actor];
}
exports.getActors = getActors;
//# sourceMappingURL=getActors.js.map