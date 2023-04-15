"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdByToken = void 0;
async function getUserIdByToken(token) {
    return (await this.adapters.db.findStringIdByValue('token', token)) ?? null;
}
exports.getUserIdByToken = getUserIdByToken;
//# sourceMappingURL=getUserIdByToken.js.map