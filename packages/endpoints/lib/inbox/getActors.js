"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
async function getActors() {
    const actor = await this.core.findOne('entity', {
        inbox: this.url.href,
    });
    type_utilities_1.assert.isApActor(actor);
    return [actor];
}
exports.getActors = getActors;
//# sourceMappingURL=getActors.js.map