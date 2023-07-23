"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function getActors() {
    type_utilities_1.assert.isApActivity(this.activity);
    const actorUrls = await this.core.getRecipientUrls(this.activity);
    return (await Promise.all(actorUrls.map(async (actorUrl) => {
        if (!(0, utilities_1.isLocal)(actorUrl)) {
            return [];
        }
        try {
            const foundEntity = await this.core.findEntityById(actorUrl);
            type_utilities_1.assert.isApActor(foundEntity);
            return [foundEntity];
        }
        catch (error) {
            return [];
        }
    }))).flat();
}
exports.getActors = getActors;
//# sourceMappingURL=getActors.js.map