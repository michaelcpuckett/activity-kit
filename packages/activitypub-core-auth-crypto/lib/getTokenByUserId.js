"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenByUserId = void 0;
async function getTokenByUserId(userId) {
    const token = await this.adapters.crypto.randomBytes(16);
    await this.adapters.db.saveString('token', userId, token);
    return token;
}
exports.getTokenByUserId = getTokenByUserId;
//# sourceMappingURL=getTokenByUserId.js.map