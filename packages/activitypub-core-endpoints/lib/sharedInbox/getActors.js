"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
async function getActors() {
    (0, activitypub_core_types_1.assertIsApActivity)(this.activity);
    const actorUrls = await this.adapters.delivery.getRecipientUrls(this.activity);
    const actors = [];
    const foundEntities = await Promise.all(actorUrls.map((actorUrl) => this.adapters.db.queryById(actorUrl)));
    for (const foundEntity of foundEntities) {
        try {
            (0, activitypub_core_types_1.assertIsApActor)(foundEntity);
            actors.push(foundEntity);
        }
        catch (error) { }
    }
    return actors;
}
exports.getActors = getActors;
//# sourceMappingURL=getActors.js.map