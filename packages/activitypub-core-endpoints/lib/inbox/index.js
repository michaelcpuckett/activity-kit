"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxPostEndpoint = void 0;
const getActors_1 = require("./getActors");
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
    actors = [];
    activity = null;
    constructor(req, res, adapters, plugins) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
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
    async isBlocked() {
        if (!('actor' in this.activity)) {
            return;
        }
        const streams = await Promise.all(this.actor.streams.map(async (stream) => await this.adapters.db.queryById(stream)));
        const blocks = streams.find((stream) => {
            if (stream.name === 'Blocks') {
                return true;
            }
        });
        if (!blocks) {
            return false;
        }
        const blockedItems = blocks.items ? Array.isArray(blocks.items) ? blocks.items : [blocks.items] : [];
        const blockedActors = await Promise.all(blockedItems.map(async (id) => (await this.adapters.db.queryById(id))?.object));
        const potentiallyBlockedActorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
        return blockedActors.map(id => id.toString()).includes(potentiallyBlockedActorId.toString());
    }
    async respond() {
        try {
            await this.parseBody();
            const existingActivity = await this.adapters.db.findEntityById((0, activitypub_core_utilities_1.getId)(this.activity)) ?? await this.adapters.db.findOne('foreign-entity', {
                id: (0, activitypub_core_utilities_1.getId)(this.activity).toString(),
            });
            if (existingActivity) {
                console.log('We have already received this activity. Assuming it was forwarded by another server.');
                this.res.statusCode = 200;
                this.res.end();
                return;
            }
            await this.getActors();
            for (const actor of this.actors) {
                this.actor = actor;
                const isBlocked = await this.isBlocked();
                if (isBlocked) {
                    console.log('BLOCKED!');
                    continue;
                }
                await this.runSideEffects();
                console.log(this.activity);
                console.log('inserting', actor.inbox, (0, activitypub_core_utilities_1.getId)(actor.inbox), (0, activitypub_core_utilities_1.getId)(this.activity));
                await this.adapters.db.insertOrderedItem(actor.inbox, (0, activitypub_core_utilities_1.getId)(this.activity));
            }
            await this.adapters.db.saveEntity(this.activity);
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