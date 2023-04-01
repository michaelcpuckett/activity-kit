"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenByUserId = void 0;
const randomBytes = () => {
    const array = new Uint32Array(16);
    const random = crypto.getRandomValues(array);
    return String.fromCharCode(...random);
};
function getTokenByUserId(userId) {
    const token = randomBytes();
    if (!('cookieStore' in this.params)) {
        throw new Error('Error');
    }
    this.params.cookieStore[token] = userId;
    return token;
}
exports.getTokenByUserId = getTokenByUserId;
//# sourceMappingURL=getTokenByUserId.js.map