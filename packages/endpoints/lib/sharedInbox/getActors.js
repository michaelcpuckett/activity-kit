"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const utilities_1 = require("@activity-kit/utilities");
const types_1 = require("@activity-kit/types");
async function getActors() {
    (0, types_1.assertIsApActivity)(this.activity);
    const actorUrls = await this.core.getRecipientUrls(this.activity);
    console.log(actorUrls.map((url) => url.toString()));
    return (await Promise.all(actorUrls.map(async (actorUrl) => {
        if (!(0, utilities_1.isLocal)(actorUrl)) {
            return [];
        }
        try {
            const foundEntity = await this.core.findEntityById(actorUrl);
            (0, types_1.assertIsApActor)(foundEntity);
            return [foundEntity];
        }
        catch (error) {
            return [];
        }
    }))).flat();
}
exports.getActors = getActors;
//# sourceMappingURL=getActors.js.map