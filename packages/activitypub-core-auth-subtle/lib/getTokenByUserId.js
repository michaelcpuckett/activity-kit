"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenByUserId = void 0;
const randomBytes = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
};
function getTokenByUserId(userId) {
    const token = randomBytes(16);
    if (!('cookieStore' in this.params)) {
        throw new Error('Error');
    }
    this.params.cookieStore[token] = userId;
    return token;
}
exports.getTokenByUserId = getTokenByUserId;
//# sourceMappingURL=getTokenByUserId.js.map