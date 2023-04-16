"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenAuthAdapter = void 0;
const createUser_1 = require("./createUser");
const getUserIdByToken_1 = require("./getUserIdByToken");
const getTokenByUserId_1 = require("./getTokenByUserId");
const authenticatePassword_1 = require("./authenticatePassword");
class TokenAuthAdapter {
    adapters;
    params;
    constructor(adapters) {
        this.adapters = adapters;
        this.params = {
            cookieStore: {},
        };
    }
    authenticatePassword = authenticatePassword_1.authenticatePassword;
    createUser = createUser_1.createUser;
    getUserIdByToken = getUserIdByToken_1.getUserIdByToken;
    getTokenByUserId = getTokenByUserId_1.getTokenByUserId;
}
exports.TokenAuthAdapter = TokenAuthAdapter;
//# sourceMappingURL=index.js.map