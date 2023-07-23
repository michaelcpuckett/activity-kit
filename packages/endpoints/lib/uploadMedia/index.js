"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadMediaPostEndpoint = void 0;
const getActor_1 = require("./getActor");
const authenticateActor_1 = require("./authenticateActor");
const parseBody_1 = require("./parseBody");
const cleanup_1 = require("./cleanup");
const saveActivity_1 = require("./saveActivity");
const type_utilities_1 = require("@activity-kit/type-utilities");
class UploadMediaPostEndpoint {
    routes;
    req;
    res;
    core;
    plugins;
    actor = null;
    activity = null;
    file = null;
    getActor = getActor_1.getActor;
    authenticateActor = authenticateActor_1.authenticateActor;
    parseBody = parseBody_1.parseBody;
    cleanup = cleanup_1.cleanup;
    saveActivity = saveActivity_1.saveActivity;
    constructor(routes, req, res, core, plugins) {
        this.routes = routes;
        this.req = req;
        this.res = res;
        this.core = core;
        this.plugins = plugins;
    }
    async respond() {
        try {
            await this.getActor();
            await this.authenticateActor();
            await this.parseBody();
            type_utilities_1.assert.isApExtendedObject(this.activity.object);
            const url = await this.core.upload(this.file);
            this.activity.object.url = url;
            await this.cleanup();
            await this.saveActivity();
            this.res.statusCode = 201;
            this.res.setHeader('Location', this.activity.id.toString());
            this.res.end();
        }
        catch (error) {
            console.log(error);
            this.res.statusCode = 500;
            this.res.write(String(error));
            this.res.end();
        }
    }
}
exports.UploadMediaPostEndpoint = UploadMediaPostEndpoint;
//# sourceMappingURL=index.js.map