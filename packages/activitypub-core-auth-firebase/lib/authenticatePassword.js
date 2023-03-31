"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatePassword = void 0;
const auth_1 = require("firebase/auth");
const app_1 = require("firebase/app");
async function authenticatePassword(email, password) {
    const app = (0, app_1.initializeApp)(this.params.appOptions);
    const auth = (0, auth_1.getAuth)(app);
    const { user } = await (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
    if (user) {
        return {
            uid: user.uid,
            token: '',
        };
    }
    return null;
}
exports.authenticatePassword = authenticatePassword;
//# sourceMappingURL=authenticatePassword.js.map