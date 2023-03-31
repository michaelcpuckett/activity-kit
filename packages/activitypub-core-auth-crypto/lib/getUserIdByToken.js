"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdByToken = void 0;
async function getUserIdByToken(token) {
    return this.params.cookieStore[token] || null;
}
exports.getUserIdByToken = getUserIdByToken;
//# sourceMappingURL=getUserIdByToken.js.map