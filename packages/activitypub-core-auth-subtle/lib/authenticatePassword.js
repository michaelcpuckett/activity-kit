"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatePassword = void 0;
const crypto_1 = require("crypto");
async function verifyPassword(rawPassword, hashedPassword) {
    const [saltString, storedHashedPassword] = hashedPassword.split(':');
    const encoder = new TextEncoder();
    const salt = encoder.encode(saltString);
    const storedPassword = encoder.encode(storedHashedPassword);
    const password = encoder.encode(rawPassword);
    const key = await crypto_1.subtle.importKey('raw', password, { name: 'PBKDF2' }, false, ['deriveBits']);
    const iterations = 10000;
    const derivedKey = await crypto_1.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
    return derivedKey === storedPassword;
}
async function authenticatePassword(email, password) {
    const uid = await this.adapters.db.findStringIdByValue('email', email);
    if (!uid) {
        return null;
    }
    const hashedPassword = await this.adapters.db.findStringValueById('hashedPassword', uid);
    if (await verifyPassword(password, hashedPassword)) {
        const token = this.getTokenByUserId(uid);
        return {
            uid,
            token,
        };
    }
    return null;
}
exports.authenticatePassword = authenticatePassword;
//# sourceMappingURL=authenticatePassword.js.map