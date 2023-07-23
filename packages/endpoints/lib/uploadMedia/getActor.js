"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActor = void 0;
const utilities_1 = require("@activity-kit/utilities");
const type_utilities_1 = require("@activity-kit/type-utilities");
async function getActor() {
    const url = new URL(this.req.url, utilities_1.LOCAL_DOMAIN);
    const actor = await this.core.findOne('entity', {
        'endpoints.uploadMedia': url.toString(),
    });
    type_utilities_1.assert.isApActor(actor);
    this.actor = actor;
}
exports.getActor = getActor;
//# sourceMappingURL=getActor.js.map