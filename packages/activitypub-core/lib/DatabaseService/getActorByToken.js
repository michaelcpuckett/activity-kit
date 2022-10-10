"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActorByToken = void 0;
async function getActorByToken(token, credentials) {
    const userId = await this.getAuthenticatedUserIdByToken(token, credentials);
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
exports.getActorByToken = getActorByToken;
//# sourceMappingURL=getActorByToken.js.map