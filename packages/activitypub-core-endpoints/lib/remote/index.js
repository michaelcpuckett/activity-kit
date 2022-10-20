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
exports.remoteHandler = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const queryString = __importStar(require("query-string"));
const entity_1 = require("../entity");
async function remoteHandler(req, res, authenticationService, databaseService) {
    if (!req || !req.url) {
        throw new Error('Bad request');
    }
    const query = {
        ...queryString.parse(new URL(req.url, activitypub_core_utilities_1.LOCAL_DOMAIN).search),
    };
    const resource = query.resource ?? '';
    if (resource) {
        return (0, entity_1.entityGetHandler)(req, res, authenticationService, databaseService, new URL(query.resource));
    }
    res.statusCode = 404;
    res.end();
}
exports.remoteHandler = remoteHandler;
//# sourceMappingURL=index.js.map