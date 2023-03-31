"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatePassword = void 0;
const crypto_1 = require("crypto");
async function verifyPassword(password, hashedPassword) {
    const [salt, storedHashedPassword] = hashedPassword.split(':');
    const derivedKey = await new Promise((resolve, reject) => {
        (0, crypto_1.pbkdf2)(password, salt, 100000, 64, 'sha512', (err, key) => {
            if (err)
                reject(err);
            resolve(key.toString('hex'));
        });
    });
    return derivedKey === storedHashedPassword;
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