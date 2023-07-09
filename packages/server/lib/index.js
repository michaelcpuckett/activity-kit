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
const express = __importStar(require("express"));
const path = __importStar(require("path"));
const mongodb_1 = require("mongodb");
const db_mongo_1 = require("@activity-kit/db-mongo");
const auth_token_1 = require("@activity-kit/auth-token");
const crypto_node_1 = require("@activity-kit/crypto-node");
const utilities_1 = require("@activity-kit/utilities");
(async () => {
    const app = express.default();
    app.use(express.static(path.resolve(__dirname, '../static')));
    const mongoClient = new mongodb_1.MongoClient(process.env.AP_MONGO_CLIENT_URL ?? 'mongodb://127.0.0.1:27017');
    await mongoClient.connect();
    const mongoDb = mongoClient.db(process.env.AP_MONGO_DB_NAME ?? 'activitypub');
    const mongoDbAdapter = new db_mongo_1.MongoDbAdapter(mongoDb);
    const nodeCryptoAdapter = new crypto_node_1.NodeCryptoAdapter();
    const tokenAuthAdapter = new auth_token_1.TokenAuthAdapter({
        db: mongoDbAdapter,
        crypto: nodeCryptoAdapter,
    });
    app.post('/login', async (req, res, next) => {
        const body = JSON.parse(await (0, utilities_1.streamToString)(req));
        const email = body.email;
        const password = body.password;
        if (!email) {
            res.send({
                success: false,
                error: 'Email must be provided.',
            });
            next();
            return;
        }
        if (!password) {
            res.send({
                success: false,
                error: 'Password must be provided.',
            });
            next();
            return;
        }
        const result = await tokenAuthAdapter.authenticatePassword(email, password);
        res.send(result
            ? {
                success: true,
                token: result.token,
            }
            : {
                success: false,
                error: 'Invalid email and password combo.',
            });
        next();
    });
    app.get('/', async (req, res, next) => {
        const htmlResponse = `<!DOCTYPE html>
        <html>
          <h1>Hello world</h1>
        </html>
    `;
        res.send(htmlResponse);
        next();
    });
    app.listen(process.env.PORT ?? process.env.AP_PORT ?? 3000, () => {
        console.log('Running...');
    });
})();
//# sourceMappingURL=index.js.map