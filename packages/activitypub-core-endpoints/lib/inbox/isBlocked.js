"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlocked = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function isBlocked(actor) {
    if (!('actor' in this.activity)) {
        return;
    }
    const streams = await Promise.all(actor.streams.map(async (stream) => await this.adapters.db.queryById(stream)));
    const blocks = streams.find((stream) => {
        if (stream.name === 'Blocks') {
            return true;
        }
    });
    if (!blocks) {
        return false;
    }
    const blockedItems = blocks.items ? Array.isArray(blocks.items) ? blocks.items : [blocks.items] : [];
    const blockedActors = await Promise.all(blockedItems.map(async (id) => (await this.adapters.db.queryById(id))?.object));
    const potentiallyBlockedActorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
    return blockedActors.map(id => id.toString()).includes(potentiallyBlockedActorId.toString());
}
exports.isBlocked = isBlocked;
//# sourceMappingURL=isBlocked.js.map