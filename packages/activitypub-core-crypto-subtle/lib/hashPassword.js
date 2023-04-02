"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
async function hashPassword(password, salt) {
    if (!(this.params.subtle instanceof SubtleCrypto)) {
        throw new Error('Bad crypto.');
    }
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(salt);
    const derivedKeyBuffer = await this.params.subtle.deriveBits({
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 100000,
        hash: 'SHA-512',
    }, await this.params.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, ['deriveBits']), 512);
    const derivedKeyArray = new Uint8Array(derivedKeyBuffer);
    return Array.prototype.map
        .call(derivedKeyArray, (x) => ('00' + x.toString(16)).slice(-2))
        .join('');
}
exports.hashPassword = hashPassword;
//# sourceMappingURL=hashPassword.js.map