"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPostEndpoint = exports.User = void 0;
const utilities_1 = require("@activity-kit/utilities");
const createServerActor_1 = require("./createServerActor");
const createUserActor_1 = require("./createUserActor");
class User {
    type;
    email;
    name;
    preferredUsername;
    password;
    constructor(rawBody) {
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
    headers;
    body;
    core;
    plugins;
    constructor(routes, headers, body, core, plugins) {
        this.routes = routes;
        this.headers = headers;
        this.body = body;
        this.core = core;
        this.plugins = plugins;
    }
    createServerActor = createServerActor_1.createServerActor;
    createUserActor = createUserActor_1.createUserActor;
    async respond() {
        const result = await new Promise((resolve) => {
            resolve(new User(this.body));
        }).catch((error) => {
            console.log(error);
            return new Error(`${error}`);
        });
        if (result instanceof Error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Internal server error.',
                }),
            };
        }
        const user = result;
        const isUsernameTaken = !!(await this.core.findOne('entity', {
            preferredUsername: user.preferredUsername,
        }));
        if (isUsernameTaken ||
            utilities_1.RESERVED_USERNAMES.includes(user.preferredUsername)) {
            return {
                statusCode: 409,
                body: JSON.stringify({
                    error: 'Username taken.',
                    field: 'username',
                }),
            };
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
            return {
                statusCode: 201,
                body: JSON.stringify({
                    token,
                }),
            };
        }
        catch (error) {
            return {
                statusCode: 300,
                body: JSON.stringify({
                    error: error.toString(),
                }),
            };
        }
    }
}
exports.UserPostEndpoint = UserPostEndpoint;
//# sourceMappingURL=index.js.map