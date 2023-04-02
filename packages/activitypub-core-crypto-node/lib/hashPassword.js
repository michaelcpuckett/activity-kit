"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const crypto_1 = require("crypto");
async function hashPassword(password, salt) {
    return await new Promise((resolve, reject) => {
        (0, crypto_1.pbkdf2)(password, salt, 100000, 64, "sha512", (err, key) => {
            if (err)
                reject(err);
            resolve(key.toString("hex"));
        });
    });
}
exports.hashPassword = hashPassword;
//# sourceMappingURL=hashPassword.js.map