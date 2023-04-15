"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatePassword = void 0;
async function authenticatePassword(email, password) {
    const uid = await this.adapters.db.findStringIdByValue('email', email);
    if (!uid) {
        return null;
    }
    const hashedPassword = await this.adapters.db.findStringValueById('hashedPassword', uid);
    const verifyPassword = async () => {
        const [salt, storedHashedPassword] = hashedPassword.split(':');
        const derivedKey = await this.adapters.crypto.hashPassword(password, salt);
        return derivedKey === storedHashedPassword;
    };
    if (await verifyPassword()) {
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