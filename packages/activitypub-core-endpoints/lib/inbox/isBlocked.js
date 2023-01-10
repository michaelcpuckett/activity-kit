"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlocked = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function isBlocked(actor) {
    try {
        (0, activitypub_core_types_1.assertIsApActivity)(this.activity);
        const activityActorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
        (0, activitypub_core_types_1.assertExists)(activityActorId);
        const activityActor = await this.adapters.db.queryById(activityActorId);
        (0, activitypub_core_types_1.assertIsApActor)(activityActor);
        const blocks = await this.adapters.db.getStreamByName(actor, 'Blocks');
        (0, activitypub_core_types_1.assertIsApCollection)(blocks);
        (0, activitypub_core_types_1.assertIsArray)(blocks.items);
        const blockedActorIds = await Promise.all(blocks.items.map(async (item) => {
            const id = (0, activitypub_core_utilities_1.getId)(item);
            const foundActivity = await this.adapters.db.findEntityById(id);
            return (0, activitypub_core_utilities_1.getId)(foundActivity?.object);
        }));
        return blockedActorIds
            .map((id) => `${id}`)
            .includes(`${activityActorId}`);
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
exports.isBlocked = isBlocked;
//# sourceMappingURL=isBlocked.js.map