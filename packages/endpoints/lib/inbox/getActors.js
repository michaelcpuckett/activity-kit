"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
async function getActors() {
    const actor = await this.core.findOne('entity', {
        inbox: this.url.href,
    });
    if (!actor || !actor.id || !('inbox' in actor)) {
        throw new Error('No actor with this inbox.');
    }
    return [actor];
}
exports.getActors = getActors;
//# sourceMappingURL=getActors.js.map