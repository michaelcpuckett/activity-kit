"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateKey = void 0;
async function getPrivateKey(actor) {
    if (!actor.preferredUsername) {
        throw new Error('Actor has no `preferredUsername`.');
    }
    const userId = await this.findStringIdByValue('username', actor.preferredUsername);
    const privateKey = await this.findStringValueById('privateKey', userId);
    if (!privateKey) {
        throw new Error('Private key not found for this Actor.');
    }
    return privateKey;
}
exports.getPrivateKey = getPrivateKey;
//# sourceMappingURL=getPrivateKey.js.map