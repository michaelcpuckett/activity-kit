"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
async function getActors() {
    (0, activitypub_core_types_1.assertIsApActivity)(this.activity);
    const actorUrls = await this.lib.getRecipientUrls(this.activity);
    console.log(actorUrls.map((url) => url.toString()));
    return (await Promise.all(actorUrls.map(async (actorUrl) => {
        if ((0, activitypub_core_utilities_1.getCollectionNameByUrl)(actorUrl) === 'foreignEntity') {
            return [];
        }
        try {
            const foundEntity = await this.lib.findEntityById(actorUrl);
            (0, activitypub_core_types_1.assertIsApActor)(foundEntity);
            return [foundEntity];
        }
        catch (error) {
            return [];
        }
    }))).flat();
}
exports.getActors = getActors;
//# sourceMappingURL=getActors.js.map