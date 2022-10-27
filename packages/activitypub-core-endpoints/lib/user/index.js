"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPostHandler = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const createServerActor_1 = require("./createServerActor");
const createUserActor_1 = require("./createUserActor");
async function userPostHandler(req, res, authenticationService, databaseService, plugins) {
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
    const user = await authenticationService.createUser({
        email,
        password,
        preferredUsername,
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
    }, plugins);
    res.statusCode = 200;
    res.write(JSON.stringify({
        success: true,
    }));
    res.end();
    return;
}
exports.userPostHandler = userPostHandler;
//# sourceMappingURL=index.js.map