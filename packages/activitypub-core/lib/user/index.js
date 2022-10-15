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
exports.userPostHandler = void 0;
const firebaseAdmin = __importStar(require("firebase-admin"));
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const createServerActor_1 = require("./createServerActor");
const createUserActor_1 = require("./createUserActor");
async function userPostHandler(req, res, serviceAccount, databaseService, setup) {
    const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            resolve(JSON.parse(data));
        });
        req.on('error', function () {
            reject('Failed to make an OAuth request');
        });
    });
    const { email, password, name, preferredUsername } = body;
    const isUsernameTaken = !!(await databaseService.findOne('actor', {
        preferredUsername,
    }));
    if (isUsernameTaken || activitypub_core_utilities_1.RESERVED_USERNAMES.includes(preferredUsername)) {
        res.statusCode = 409;
        res.write(JSON.stringify({
            error: 'Username Taken.',
        }));
        res.end();
        return;
    }
    if (!firebaseAdmin.apps.length) {
        const appOptions = {
            credential: firebaseAdmin.credential.cert(serviceAccount),
            projectId: 'socialweb-id',
        };
        firebaseAdmin.initializeApp(appOptions);
    }
    const user = await firebaseAdmin.auth().createUser({
        email,
        emailVerified: false,
        password,
        displayName: preferredUsername,
        disabled: false,
    });
    const isBotCreated = !!(await databaseService.findOne('actor', {
        preferredUsername: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
    }));
    if (!isBotCreated) {
        await (0, createServerActor_1.createServerActor)(databaseService);
    }
    await (0, createUserActor_1.createUserActor)(databaseService, {
        uid: user.uid,
        email,
        preferredUsername,
        name,
    });
    if (setup) {
        const actor = await databaseService.findOne('actor', {
            preferredUsername,
        });
        if (actor && 'outbox' in actor) {
            await setup(actor, databaseService);
        }
    }
    res.statusCode = 200;
    res.write(JSON.stringify({
        success: true,
    }));
    res.end();
    return;
}
exports.userPostHandler = userPostHandler;
//# sourceMappingURL=index.js.map