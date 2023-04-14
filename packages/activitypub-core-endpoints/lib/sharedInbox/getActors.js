"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
async function getActors() {
    (0, activitypub_core_types_1.assertIsApActivity)(this.activity);
    const actorUrls = await this.adapters.delivery.getRecipientUrls(this.activity);
    const actors = [];
    const foundEntities = await Promise.all(actorUrls.map(async (actorUrl) => {
        const isLocal = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(actorUrl) !== 'foreignEntity';
        if (isLocal) {
            return await this.adapters.db.findEntityById(actorUrl);
        }
    }));
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