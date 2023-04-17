"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActor = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
async function getActor() {
    const url = new URL(this.req.url, utilities_1.LOCAL_DOMAIN);
    const actor = await this.core.findOne('entity', {
        'endpoints.uploadMedia': url.toString(),
    });
    (0, types_1.assertIsApActor)(actor);
    this.actor = actor;
}
exports.getActor = getActor;
//# sourceMappingURL=getActor.js.map