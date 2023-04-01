"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdByToken = void 0;
async function getUserIdByToken(token) {
    if (!('cookieStore' in this.params)) {
        throw new Error('Error');
    }
    return this.params.cookieStore[token] || null;
}
exports.getUserIdByToken = getUserIdByToken;
//# sourceMappingURL=getUserIdByToken.js.map