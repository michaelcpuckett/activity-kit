"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxPostEndpoint = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const getActors_1 = require("./getActors");
const parseBody_1 = require("./parseBody");
const respond_1 = require("./respond");
const isBlocked_1 = require("./isBlocked");
const runSideEffects_1 = require("./runSideEffects");
const accept_1 = require("./sideEffects/accept");
const announce_1 = require("./sideEffects/announce");
const follow_1 = require("./sideEffects/follow");
const like_1 = require("./sideEffects/like");
const create_1 = require("./sideEffects/create");
const shouldForwardActivity_1 = require("./shouldForwardActivity");
const broadcastActivity_1 = require("./broadcastActivity");
class InboxPostEndpoint {
    core;
    activity;
    url;
    routes;
    plugins;
    constructor(core, options) {
        this.core = core;
        const activity = type_utilities_1.cast.isApActivity((0, utilities_1.convertJsonToEntity)(options.body));
        if (!activity) {
            throw new Error('Body must be an Activity.');
        }
        this.activity = activity;
        this.url = options.url;
        this.routes = options.routes;
        this.plugins = [];
    }
    getActors = getActors_1.getActors;
    runSideEffects = runSideEffects_1.runSideEffects;
    parseBody = parseBody_1.parseBody;
    broadcastActivity = broadcastActivity_1.broadcastActivity;
    shouldForwardActivity = shouldForwardActivity_1.shouldForwardActivity;
    handleCreate = create_1.handleCreate;
    handleAccept = accept_1.handleAccept;
    handleAnnounce = announce_1.handleAnnounce;
    handleFollow = follow_1.handleFollow;
    handleLike = like_1.handleLike;
    isBlocked = isBlocked_1.isBlocked;
    respond = respond_1.respond;
}
exports.InboxPostEndpoint = InboxPostEndpoint;
//# sourceMappingURL=index.js.map