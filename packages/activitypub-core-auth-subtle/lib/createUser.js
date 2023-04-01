"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const crypto_1 = require("crypto");
const randomBytes = () => {
    const array = new Uint32Array(16);
    const random = crypto.getRandomValues(array);
    return String.fromCharCode(...random);
};
async function hashPassword(rawPassword) {
    const encoder = new TextEncoder();
    const password = encoder.encode(rawPassword);
    const key = await crypto_1.subtle.importKey('raw', password, { name: 'PBKDF2' }, false, ['deriveBits']);
    const saltString = randomBytes();
    const salt = encoder.encode(saltString);
    const iterations = 10000;
    const hashedPassword = await crypto_1.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
    return `${saltString}:${hashedPassword}`;
}
async function createUser({ email, password, preferredUsername, }) {
    const uid = randomBytes();
    const hashedPassword = await hashPassword(password);
    const token = this.getTokenByUserId(uid);
    this.adapters.db.saveString('username', uid, preferredUsername);
    this.adapters.db.saveString('email', uid, email);
    this.adapters.db.saveString('hashedPassword', uid, hashedPassword);
    return { uid, token };
}
exports.createUser = createUser;
//# sourceMappingURL=createUser.js.map