"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPostEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const createServerActor_1 = require("./createServerActor");
const createUserActor_1 = require("./createUserActor");
class UserPostEndpoint {
    req;
    res;
    adapters;
    plugins;
    constructor(req, res, adapters, plugins) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
    }
    createServerActor = createServerActor_1.createServerActor;
    createUserActor = createUserActor_1.createUserActor;
    async respond() {
        const body = await new Promise((resolve, reject) => {
            let data = '';
            this.req.on('data', function (chunk) {
                data += chunk;
            });
            this.req.on('end', function () {
                resolve(JSON.parse(data));
            });
            this.req.on('error', function () {
                reject('Failed to make an OAuth request');
            });
        });
        const { email, password, name, preferredUsername } = body;
        const isUsernameTaken = !!(await this.adapters.db.findOne('actor', {
            preferredUsername,
        }));
        if (isUsernameTaken || activitypub_core_utilities_1.RESERVED_USERNAMES.includes(preferredUsername)) {
            this.res.statusCode = 409;
            this.res.write(JSON.stringify({
                error: 'Username Taken.',
            }));
            this.res.end();
            return;
        }
        const user = await this.adapters.auth.createUser({
            email,
            password,
            preferredUsername,
        });
        const isBotCreated = !!(await this.adapters.db.findOne('actor', {
            preferredUsername: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
        }));
        if (!isBotCreated) {
            await this.createServerActor();
        }
        await this.createUserActor({
            uid: user.uid,
            email,
            preferredUsername,
            name,
        });
        this.res.statusCode = 200;
        this.res.write(JSON.stringify({
            success: true,
        }));
        this.res.end();
    }
}
exports.UserPostEndpoint = UserPostEndpoint;
//# sourceMappingURL=index.js.map