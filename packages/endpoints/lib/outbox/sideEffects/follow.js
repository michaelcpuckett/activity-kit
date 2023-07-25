"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFollow = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleFollow(activity) {
    const actorId = (0, utilities_1.getId)(activity.actor);
    type_utilities_1.assert.exists(actorId);
    const actor = await this.core.findEntityById(actorId);
    type_utilities_1.assert.isApActor(actor);
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    if (objectId.href === actorId.href) {
        throw new Error('Cannot follow self.');
    }
}
exports.handleFollow = handleFollow;
//# sourceMappingURL=follow.js.map