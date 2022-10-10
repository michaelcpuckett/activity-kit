"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserPostRequest = void 0;
const activitypub_core_1 = require("activitypub-core");
const credentials_1 = __importDefault(require("../../credentials"));
const handleUserPostRequest = async (req, res) => {
    return (0, activitypub_core_1.userPostHandler)(credentials_1.default)(req, res);
};
exports.handleUserPostRequest = handleUserPostRequest;
//# sourceMappingURL=user.js.map