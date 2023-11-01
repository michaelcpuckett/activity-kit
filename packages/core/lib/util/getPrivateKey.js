"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateKey = void 0;
/**
 * Get the private key of an Actor.
 *
 * @returns The private key as a string.
 */
async function getPrivateKey(actor) {
    if (!actor.preferredUsername) {
        return '';
    }
    const userId = await this.findStringIdByValue('username', actor.preferredUsername);
    if (!userId) {
        return '';
    }
    return await this.findStringValueById('privateKey', userId);
}
exports.getPrivateKey = getPrivateKey;
//# sourceMappingURL=getPrivateKey.js.map