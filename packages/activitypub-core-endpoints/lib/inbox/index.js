"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inboxHandler = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const entity_1 = require("../entity");
const accept_1 = require("./accept");
const announce_1 = require("./announce");
const follow_1 = require("./follow");
const like_1 = require("./like");
const shouldForwardActivity_1 = require("./shouldForwardActivity");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
async function inboxHandler(req, res, authenticationService, databaseService, deliveryService) {
    if (!req) {
        throw new Error('Bad request.');
    }
    if (req.method === 'POST') {
        return await handlePost(req, res, databaseService, deliveryService);
    }
    return await (0, entity_1.entityGetHandler)(req, res, authenticationService, databaseService);
}
exports.inboxHandler = inboxHandler;
async function handlePost(req, res, databaseService, deliveryService) {
    if (!req || !res) {
        throw new Error('No response object.');
    }
    const url = `${activitypub_core_utilities_1.LOCAL_DOMAIN}${req.url}`;
    try {
        const recipient = await databaseService.findOne('actor', {
            inbox: url,
        });
        if (!recipient || !recipient.id || !('inbox' in recipient)) {
            throw new Error('No actor with this inbox.');
        }
        const recipientInboxId = new URL(url);
        const activity = await (0, activitypub_core_utilities_3.parseStream)(req);
        console.log(activity);
        console.log('^ activity from user inbox');
        if (!activity) {
            throw new Error('bad JSONLD?');
        }
        const activityId = activity.id;
        if (!activityId) {
            throw new Error('Activity does not have an ID?');
        }
        if (!('actor' in activity)) {
            throw new Error('Bad activity, no actor.');
        }
        switch (activity.type) {
            case activitypub_core_types_1.AP.ActivityTypes.FOLLOW:
                await (0, follow_1.handleFollow)(activity, databaseService, deliveryService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.ACCEPT:
                await (0, accept_1.handleAccept)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.LIKE:
                await (0, like_1.handleLike)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE:
                await (0, announce_1.handleAnnounce)(activity, databaseService);
                break;
        }
        if (await (0, shouldForwardActivity_1.shouldForwardActivity)(activity, recipient, databaseService)) {
            await deliveryService.broadcast(activity, recipient);
        }
        await databaseService.saveEntity(activity);
        await databaseService.insertOrderedItem(recipientInboxId, activityId);
        res.statusCode = 200;
        res.write((0, activitypub_core_utilities_2.stringify)(activity));
        res.end();
        return {
            props: {},
        };
    }
    catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.write('Bad request');
        res.end();
        return {
            props: {},
        };
    }
}
//# sourceMappingURL=index.js.map