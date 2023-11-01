"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActorByUserId = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
/**
 * Finds an Actor by its User ID.
 *
 * The User ID is stored in the database and is not the same as the Actor's ID.
 *
 * @returns The Actor, or null if not found.
 */
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