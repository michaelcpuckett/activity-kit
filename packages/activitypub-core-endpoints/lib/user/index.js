"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPostEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const createServerActor_1 = require("./createServerActor");
const createUserActor_1 = require("./createUserActor");
class UserPostEndpoint {
    routes;
    req;
    res;
    layers;
    plugins;
    constructor(routes, req, res, layers, plugins) {
        this.routes = routes;
        this.req = req;
        this.res = res;
        this.layers = layers;
        this.plugins = plugins;
    }
    createServerActor = createServerActor_1.createServerActor;
    createUserActor = createUserActor_1.createUserActor;
    async respond() {
        const body = JSON.parse(await (0, activitypub_core_utilities_1.streamToString)(this.req));
        const { email, type, password, name, preferredUsername } = body;
        if (!email) {
            this.res.statusCode = 300;
            this.res.write(JSON.stringify({
                error: 'Email is required.',
                field: 'email',
            }));
            this.res.end();
            return;
        }
        if (!password) {
            this.res.statusCode = 300;
            this.res.write(JSON.stringify({
                error: 'Password is required.',
                field: 'password',
            }));
            this.res.end();
            return;
        }
        if (!preferredUsername) {
            this.res.statusCode = 300;
            this.res.write(JSON.stringify({
                error: 'Username is required.',
                field: 'username',
            }));
            this.res.end();
            return;
        }
        const isUsernameTaken = !!(await this.layers.data.findOne('entity', {
            preferredUsername,
        }));
        if (isUsernameTaken || activitypub_core_utilities_1.RESERVED_USERNAMES.includes(preferredUsername)) {
            this.res.statusCode = 409;
            this.res.write(JSON.stringify({
                error: 'Username taken.',
                field: 'username',
            }));
            this.res.end();
            return;
        }
        try {
            const { uid, token } = await this.layers.auth.createUser({
                email,
                password,
                preferredUsername,
            });
            const isBotCreated = !!(await this.layers.data.findOne('entity', {
                preferredUsername: activitypub_core_utilities_1.SERVER_ACTOR_USERNAME,
            }));
            if (!isBotCreated) {
                await this.createServerActor();
            }
            await this.createUserActor({
                uid,
                type,
                email,
                preferredUsername,
                name,
            });
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