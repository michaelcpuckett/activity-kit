"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActor = void 0;
const types_1 = require("@activity-kit/types");
async function getActor() {
    const actor = await this.core.findOne('entity', {
        outbox: this.url.toString(),
    });
    (0, types_1.assertIsApActor)(actor);
    this.actor = actor;
}
exports.getActor = getActor;
//# sourceMappingURL=getActor.js.map