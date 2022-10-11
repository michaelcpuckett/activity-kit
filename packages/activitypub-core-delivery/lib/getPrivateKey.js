"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateKey = void 0;
async function getPrivateKey(actor) {
    if (!actor.preferredUsername) {
        throw new Error('Bad actor');
    }
    const userId = await this.databaseService.findStringIdByValue('username', actor.preferredUsername);
    const privateKey = await this.databaseService.findStringValueById('private-key', userId);
    if (!privateKey) {
        throw new Error("User's private key not found.");
    }
    return privateKey;
}
exports.getPrivateKey = getPrivateKey;
//# sourceMappingURL=getPrivateKey.js.map