"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxEndpoint = exports.inboxHandler = void 0;
const entity_1 = require("../entity");
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
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function inboxHandler(req, res, authenticationService, databaseService, deliveryService) {
    if (req.method === 'POST') {
        return await new InboxEndpoint(req, res, databaseService, deliveryService).handlePost();
    }
    return await (0, entity_1.entityGetHandler)(req, res, authenticationService, databaseService);
}
exports.inboxHandler = inboxHandler;
class InboxEndpoint {
    req;
    res;
    databaseService;
    deliveryService;
    activity = null;
    actor = null;
    getActor = getActor_1.getActor;
    runSideEffects = runSideEffects_1.runSideEffects;
    parseBody = parseBody_1.parseBody;
    saveActivity = saveActivity_1.saveActivity;
    shouldForwardActivity = shouldForwardActivity_1.shouldForwardActivity;
    handleCreate = create_1.handleCreate;
    handleAccept = accept_1.handleAccept;
    handleAnnounce = announce_1.handleAnnounce;
    handleFollow = follow_1.handleFollow;
    handleLike = like_1.handleLike;
    constructor(req, res, databaseService, deliveryService) {
        this.req = req;
        this.res = res;
        this.databaseService = databaseService;
        this.deliveryService = deliveryService;
    }
    async handlePost() {
        try {
            await this.getActor();
            await this.parseBody();
            await this.runSideEffects();
            if (!('actor' in this.activity)) {
                throw new Error('Bad activity: no actor.');
            }
            if (await this.shouldForwardActivity()) {
                await this.deliveryService.broadcast(this.activity, this.actor);
            }
            await this.saveActivity();
            this.res.statusCode = 200;
            this.res.write((0, activitypub_core_utilities_1.stringify)(this.activity));
            this.res.end();
            return {
                props: {},
            };
        }
        catch (error) {
            console.log(error);
            this.res.statusCode = 500;
            this.res.write(String(error));
            this.res.end();
            return {
                props: {},
            };
        }
    }
}
exports.InboxEndpoint = InboxEndpoint;
//# sourceMappingURL=index.js.map