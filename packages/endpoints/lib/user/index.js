"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPostEndpoint = exports.User = void 0;
const utilities_1 = require("@activity-kit/utilities");
const createServerActor_1 = require("./createServerActor");
const createUserActor_1 = require("./createUserActor");
class User {
    uid;
    type;
    email;
    name;
    preferredUsername;
    password;
    constructor(rawBody) {
        if (typeof rawBody.uid !== 'string') {
            throw {
                error: 'No uid provided',
                field: 'uid',
            };
        }
        if (typeof rawBody.type !== 'string') {
            throw {
                error: 'No type provided',
                field: 'type',
            };
        }
        if (typeof rawBody.email !== 'string') {
            throw {
                error: 'Email is required.',
                field: 'email',
            };
        }
        if (typeof rawBody.name !== 'string') {
            throw {
                error: 'Name is required.',
                field: 'name',
            };
        }
        if (typeof rawBody.preferredUsername !== 'string') {
            throw {
                error: 'Preferred Username is required.',
                field: 'preferredUsername',
            };
        }
        if (typeof rawBody.password !== 'string') {
            throw {
                error: 'Password is required.',
                field: 'password',
            };
        }
        this.uid = rawBody.uid;
        this.type = rawBody.type;
        this.email = rawBody.email;
        this.name = rawBody.name;
        this.preferredUsername = rawBody.preferredUsername;
        this.password = rawBody.password;
    }
}
exports.User = User;
class UserPostEndpoint {
    routes;
    req;
    res;
    core;
    plugins;
    constructor(routes, req, res, core, plugins) {
        this.routes = routes;
        this.req = req;
        this.res = res;
        this.core = core;
        this.plugins = plugins;
    }
    createServerActor = createServerActor_1.createServerActor;
    createUserActor = createUserActor_1.createUserActor;
    async respond() {
        const body = JSON.parse(await (0, utilities_1.streamToString)(this.req));
        const user = await new Promise((resolve) => {
            resolve(new User(body));
        }).catch((error) => {
            this.res.statusCode = 300;
            this.res.write(JSON.stringify(error));
            this.res.end();
        });
        if (!user) {
            return;
        }
        const isUsernameTaken = !!(await this.core.findOne('entity', {
            preferredUsername: user.preferredUsername,
        }));
        if (isUsernameTaken ||
            utilities_1.RESERVED_USERNAMES.includes(user.preferredUsername)) {
            this.res.statusCode = 409;
            this.res.write(JSON.stringify({
                error: 'Username taken.',
                field: 'username',
            }));
            this.res.end();
            return;
        }
        try {
            const { uid, token } = await this.core.createUser({
                email: user.email,
                password: user.password,
                preferredUsername: user.preferredUsername,
            });
            const isBotCreated = !!(await this.core.findOne('entity', {
                preferredUsername: utilities_1.SERVER_ACTOR_USERNAME,
            }));
            if (!isBotCreated) {
                await this.createServerActor();
            }
            await this.createUserActor(user, uid);
            this.res.statusCode = 200;
            this.res.write(JSON.stringify({
                token,
            }));
            this.res.end();
        }
        catch (error) {
            this.res.statusCode = 300;
            this.res.write(JSON.stringify({
                error: error.toString(),
            }));
            this.res.end();
        }
    }
}
exports.UserPostEndpoint = UserPostEndpoint;
//# sourceMappingURL=index.js.map