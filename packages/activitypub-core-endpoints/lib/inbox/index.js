"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxPostEndpoint = void 0;
const getActor_1 = require("./getActor");
const saveActivity_1 = require("./saveActivity");
const parseBody_1 = require("./parseBody");
const runSideEffects_1 = require("./runSideEffects");
const accept_1 = require("./sideEffects/accept");
const announce_1 = require("./sideEffects/announce");
const follow_1 = require("./sideEffects/follow");
const like_1 = require("./sideEffects/like");
const create_1 = require("./sideEffects/create");
const shouldForwardActivity_1 = require("./shouldForwardActivity");
const broadcastActivity_1 = require("./broadcastActivity");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
class InboxPostEndpoint {
    req;
    res;
    adapters;
    plugins;
    actor = null;
    activity = null;
    constructor(req, res, adapters, plugins) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
    }
    getActor = getActor_1.getActor;
    runSideEffects = runSideEffects_1.runSideEffects;
    parseBody = parseBody_1.parseBody;
    saveActivity = saveActivity_1.saveActivity;
    broadcastActivity = broadcastActivity_1.broadcastActivity;
    shouldForwardActivity = shouldForwardActivity_1.shouldForwardActivity;
    handleCreate = create_1.handleCreate;
    handleAccept = accept_1.handleAccept;
    handleAnnounce = announce_1.handleAnnounce;
    handleFollow = follow_1.handleFollow;
    handleLike = like_1.handleLike;
    async respond() {
        try {
            await this.getActor();
            await this.parseBody();
            await this.runSideEffects();
            await this.saveActivity();
            await this.broadcastActivity();
            this.res.statusCode = 200;
            this.res.write((0, activitypub_core_utilities_1.stringify)(this.activity));
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
exports.InboxPostEndpoint = InboxPostEndpoint;
//# sourceMappingURL=index.js.map