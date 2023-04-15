"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLayer = void 0;
class AuthLayer {
    getTokenByUserId;
    createUser;
    getUserIdByToken;
    authenticatePassword;
    generateKeyPair;
    constructor(adapters) {
        this.getTokenByUserId = async (userId) => await adapters.auth.getTokenByUserId(userId);
        this.createUser = async ({ email, password, preferredUsername, }) => await adapters.auth.createUser({
            email,
            password,
            preferredUsername,
        });
        this.getUserIdByToken = async (token) => await adapters.auth.getTokenByUserId(token);
        this.authenticatePassword = async (email, password) => await adapters.auth.authenticatePassword(email, password);
        this.generateKeyPair = async () => await adapters.crypto.generateKeyPair();
    }
}
exports.AuthLayer = AuthLayer;
//# sourceMappingURL=index.js.map