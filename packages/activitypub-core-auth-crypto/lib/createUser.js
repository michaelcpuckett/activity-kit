"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const crypto_1 = require("crypto");
async function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString('hex');
    const hashedPassword = await new Promise((resolve, reject) => {
        (0, crypto_1.pbkdf2)(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err)
                reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
    return `${salt}:${hashedPassword}`;
}
async function createUser({ email, password, preferredUsername, }) {
    const uid = (0, crypto_1.randomBytes)(16).toString('hex');
    const hashedPassword = await hashPassword(password);
    const token = this.getTokenByUserId(uid);
    this.adapters.db.saveString('username', uid, preferredUsername);
    this.adapters.db.saveString('email', uid, email);
    this.adapters.db.saveString('hashedPassword', uid, hashedPassword);
    return { uid, token };
}
exports.createUser = createUser;
//# sourceMappingURL=createUser.js.map