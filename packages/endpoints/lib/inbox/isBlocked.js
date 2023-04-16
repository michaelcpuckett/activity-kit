"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlocked = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function isBlocked(actor) {
    try {
        (0, types_1.assertIsApActivity)(this.activity);
        const activityActorId = (0, utilities_1.getId)(this.activity.actor);
        (0, types_1.assertExists)(activityActorId);
        const activityActor = await this.core.queryById(activityActorId);
        (0, types_1.assertIsApActor)(activityActor);
        const blocks = await this.core.getStreamByName(actor, 'Blocks');
        (0, types_1.assertIsApCollection)(blocks);
        (0, types_1.assertIsArray)(blocks.items);
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