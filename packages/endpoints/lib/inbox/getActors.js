"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const utilities_1 = require("@activity-kit/utilities");
async function getActors() {
    const url = `${utilities_1.LOCAL_DOMAIN}${this.req.url}`;
    const actor = await this.core.findOne('entity', {
        inbox: url,
    });
    if (!actor || !actor.id || !('inbox' in actor)) {
        throw new Error('No actor with this inbox.');
    }
    return [actor];
}
exports.getActors = getActors;
//# sourceMappingURL=getActors.js.map