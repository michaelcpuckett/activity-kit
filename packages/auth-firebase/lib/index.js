"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuthAdapter = void 0;
const firebaseAdmin = __importStar(require("firebase-admin"));
const createUser_1 = require("./createUser");
const getUserIdByToken_1 = require("./getUserIdByToken");
const getTokenByUserId_1 = require("./getTokenByUserId");
const authenticatePassword_1 = require("./authenticatePassword");
class FirebaseAuthAdapter {
    params;
    constructor(serviceAccount, projectId) {
        this.params.appOptions = {
            credential: firebaseAdmin.credential.cert(serviceAccount),
            projectId,
        };
    }
    authenticatePassword = authenticatePassword_1.authenticatePassword;
    createUser = createUser_1.createUser;
    getUserIdByToken = getUserIdByToken_1.getUserIdByToken;
    getTokenByUserId = getTokenByUserId_1.getTokenByUserId;
}
exports.FirebaseAuthAdapter = FirebaseAuthAdapter;
//# sourceMappingURL=index.js.map