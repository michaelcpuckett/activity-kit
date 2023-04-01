"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtleAuthAdapter = void 0;
const createUser_1 = require("./createUser");
const getUserIdByToken_1 = require("./getUserIdByToken");
const getTokenByUserId_1 = require("./getTokenByUserId");
const authenticatePassword_1 = require("./authenticatePassword");
class SubtleAuthAdapter {
    adapters;
    params;
    constructor(adapters, params) {
        this.adapters = adapters;
        this.params = {
            ...params,
            cookieStore: {},
        };
    }
    authenticatePassword = authenticatePassword_1.authenticatePassword;
    createUser = createUser_1.createUser;
    getUserIdByToken = getUserIdByToken_1.getUserIdByToken;
    getTokenByUserId = getTokenByUserId_1.getTokenByUserId;
}
exports.SubtleAuthAdapter = SubtleAuthAdapter;
//# sourceMappingURL=index.js.map