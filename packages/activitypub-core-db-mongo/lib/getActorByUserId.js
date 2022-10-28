"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActorByUserId = void 0;
async function getActorByUserId(userId) {
    if (!userId) {
        return null;
    }
    const preferredUsername = await this.findStringValueById('username', userId);
    const user = await this.findOne('actor', { preferredUsername });
    if (user && 'preferredUsername' in user) {
        return user;
    }
    return null;
}
exports.getActorByUserId = getActorByUserId;
//# sourceMappingURL=getActorByUserId.js.map