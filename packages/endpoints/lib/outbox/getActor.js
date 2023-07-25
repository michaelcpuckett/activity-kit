"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActor = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
async function getActor() {
    const actor = await this.core.findOne('entity', {
        outbox: this.url.href,
    });
    type_utilities_1.assert.isApActor(actor);
    this.actor = actor;
}
exports.getActor = getActor;
//# sourceMappingURL=getActor.js.map