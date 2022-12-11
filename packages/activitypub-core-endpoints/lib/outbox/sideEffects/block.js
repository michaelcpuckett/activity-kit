"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBlock = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleBlock() {
    (0, activitypub_core_types_1.assertIsApTransitiveActivity)(this.activity);
    const actorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
    (0, activitypub_core_types_1.assertExists)(actorId);
    const actor = await this.adapters.db.queryById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const objectId = (0, activitypub_core_utilities_1.getId)(this.activity.object);
    (0, activitypub_core_types_1.assertExists)(objectId);
    const object = await this.adapters.db.queryById(objectId);
    (0, activitypub_core_types_1.assertIsApActor)(object);
    (0, activitypub_core_types_1.assertIsArray)(actor.streams);
    const streams = await Promise.all(actor.streams
        .map(stream => (0, activitypub_core_utilities_1.getId)(stream))
        .map(async (id) => id ? await this.adapters.db.findEntityById(id) : null));
    const blocks = streams.find((stream) => {
        if (stream && 'name' in stream) {
            if (stream.name === 'Blocks') {
                return true;
            }
        }
    });
    (0, activitypub_core_types_1.assertIsApEntity)(blocks);
    await this.adapters.db.insertItem(blocks.id, this.activity.id);
}
exports.handleBlock = handleBlock;
//# sourceMappingURL=block.js.map