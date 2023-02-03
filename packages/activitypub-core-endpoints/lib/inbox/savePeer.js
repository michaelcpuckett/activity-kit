"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePeer = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function savePeer() {
    try {
        (0, activitypub_core_types_1.assertIsApActivity)(this.activity);
        const actorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
        const actor = await this.adapters.db.fetchEntityById(actorId);
        (0, activitypub_core_types_1.assertIsApActor)(actor);
        const sharedInboxUrl = actor.endpoints?.sharedInbox;
        (0, activitypub_core_types_1.assertExists)(sharedInboxUrl);
        await this.adapters.db.saveString('peer', sharedInboxUrl.hostname, sharedInboxUrl.toString());
    }
    catch (error) {
        console.log(error);
    }
}
exports.savePeer = savePeer;
//# sourceMappingURL=savePeer.js.map