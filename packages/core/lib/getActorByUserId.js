"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActorByUserId = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
async function getActorByUserId(userId) {
    const preferredUsername = await this.findStringValueById('username', userId);
    const user = await this.findOne('entity', { preferredUsername });
    if (!type_utilities_1.guard.isApActor(user)) {
        return null;
    }
    return user;
}
exports.getActorByUserId = getActorByUserId;
//# sourceMappingURL=getActorByUserId.js.map