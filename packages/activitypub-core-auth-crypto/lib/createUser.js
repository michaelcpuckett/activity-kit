"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
async function hashPassword(password) {
    const salt = await this.adapters.crypto.randomBytes(16);
    const hashedPassword = await this.adapters.crypto.hashPassword(password, salt);
    return `${salt}:${hashedPassword}`;
}
async function createUser({ email, password, preferredUsername, }) {
    const uid = await this.adapters.crypto.randomBytes(16);
    const hashedPassword = await hashPassword(password);
    const token = await this.getTokenByUserId(uid);
    this.adapters.db.saveString('username', uid, preferredUsername);
    this.adapters.db.saveString('email', uid, email);
    this.adapters.db.saveString('hashedPassword', uid, hashedPassword);
    return { uid, token };
}
exports.createUser = createUser;
//# sourceMappingURL=createUser.js.map