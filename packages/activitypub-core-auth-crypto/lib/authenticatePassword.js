"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatePassword = void 0;
async function verifyPassword(password, hashedPassword) {
    const [salt, storedHashedPassword] = hashedPassword.split(':');
    const derivedKey = await this.adapters.crypto.hashPassword(password, salt);
    return derivedKey === storedHashedPassword;
}
async function authenticatePassword(email, password) {
    const uid = await this.adapters.db.findStringIdByValue('email', email);
    if (!uid) {
        return null;
    }
    const hashedPassword = await this.adapters.db.findStringValueById('hashedPassword', uid);
    if (await verifyPassword(password, hashedPassword)) {
        const token = await this.getTokenByUserId(uid);
        return {
            uid,
            token,
        };
    }
    return null;
}
exports.authenticatePassword = authenticatePassword;
//# sourceMappingURL=authenticatePassword.js.map