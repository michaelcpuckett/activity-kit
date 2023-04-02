"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenByUserId = void 0;
async function getTokenByUserId(userId) {
    const token = await this.adapters.crypto.randomBytes(16);
    if (!('cookieStore' in this.params)) {
        throw new Error('Error');
    }
    this.params.cookieStore[token] = userId;
    return token;
}
exports.getTokenByUserId = getTokenByUserId;
//# sourceMappingURL=getTokenByUserId.js.map