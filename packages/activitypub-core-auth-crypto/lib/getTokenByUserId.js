"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenByUserId = void 0;
const crypto_1 = require("crypto");
function getTokenByUserId(userId) {
    const token = (0, crypto_1.randomBytes)(16).toString('hex');
    if (!('cookieStore' in this.params)) {
        throw new Error('Error');
    }
    this.params.cookieStore[token] = userId;
    return token;
}
exports.getTokenByUserId = getTokenByUserId;
//# sourceMappingURL=getTokenByUserId.js.map