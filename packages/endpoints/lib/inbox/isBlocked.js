"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlocked = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function isBlocked(actor) {
    try {
        type_utilities_1.assert.isApActivity(this.activity);
        const activityActorId = (0, utilities_1.getId)(this.activity.actor);
        type_utilities_1.assert.exists(activityActorId);
        const activityActor = await this.core.queryById(activityActorId);
        type_utilities_1.assert.isApActor(activityActor);
        const blocks = await this.core.getStreamByName(actor, 'Blocks');
        type_utilities_1.assert.isApCollection(blocks);
        type_utilities_1.assert.isArray(blocks.items);
        const blockedActorIds = await Promise.all(blocks.items
            .map(async (item) => {
            const id = (0, utilities_1.getId)(item);
            const foundActivity = await this.core.findEntityById(id);
            if (!('object' in foundActivity)) {
                return null;
            }
            return (0, utilities_1.getId)(foundActivity.object);
        })
            .filter((id) => !!id));
        return blockedActorIds.map((id) => `${id}`).includes(`${activityActorId}`);
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
exports.isBlocked = isBlocked;
//# sourceMappingURL=isBlocked.js.map