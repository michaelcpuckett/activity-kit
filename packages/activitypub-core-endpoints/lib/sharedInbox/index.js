"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientInboxIds = exports.sharedInboxHandler = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const accept_1 = require("../inbox/accept");
const announce_1 = require("../inbox/announce");
const follow_1 = require("../inbox/follow");
const like_1 = require("../inbox/like");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const activitypub_core_delivery_1 = require("activitypub-core-delivery");
async function sharedInboxHandler(req, res, databaseService, deliveryService) {
    if (!req || !res) {
        throw new Error('No response object.');
    }
    try {
        const activity = await (0, activitypub_core_utilities_2.parseStream)(req);
        console.log(activity);
        console.log('^activity: sharedInbox');
        if (!activity) {
            throw new Error('Bad jsonld?');
        }
        const activityId = activity.id;
        if (!activityId) {
            throw new Error('Activity does not have an ID?');
        }
        if (!('actor' in activity)) {
            throw new Error('Bad activity, no actor.');
        }
        const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
        if (!actorId) {
            throw new Error('Bad activity, no actor ID');
        }
        const actor = await databaseService.queryById(actorId);
        if (!actor) {
            throw new Error('Bad activity, no actor');
        }
        switch (activity.type) {
            case activitypub_core_types_1.AP.ActivityTypes.LIKE:
                await (0, like_1.handleLike)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE:
                await (0, announce_1.handleAnnounce)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.ACCEPT:
                await (0, accept_1.handleAccept)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.FOLLOW:
                await (0, follow_1.handleFollow)(activity, databaseService, deliveryService);
                break;
        }
        const recipientIds = await getRecipientInboxIds(activity, actor, databaseService, deliveryService);
        console.log({ recipientIds });
        for (const recipientId of recipientIds) {
            console.log(recipientId);
            const recipient = (await databaseService.findEntityById(recipientId));
            if (!recipient) {
                continue;
            }
            const recipientInboxId = (0, activitypub_core_utilities_1.getId)(recipient.inbox);
            console.log(recipientInboxId);
            if (!recipientInboxId) {
                continue;
            }
            await databaseService.insertOrderedItem(recipientInboxId, activityId);
        }
        await databaseService.saveEntity(activity);
        res.statusCode = 200;
        res.write((0, activitypub_core_utilities_3.stringifyWithContext)(activity));
        res.end();
    }
    catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.write('Bad request');
        res.end();
        return;
    }
}
exports.sharedInboxHandler = sharedInboxHandler;
async function getRecipientInboxIds(activity, actor, databaseService, providedDeliveryService) {
    console.log('TEST HERE', activity.cc);
    const deliveryService = providedDeliveryService ?? new activitypub_core_delivery_1.DeliveryService(databaseService);
    const recipients = [
        ...(activity.to
            ? await deliveryService.getRecipientsList(activity.to)
            : []),
        ...(activity.cc
            ? await deliveryService.getRecipientsList(activity.cc)
            : []),
        ...(activity.bto
            ? await deliveryService.getRecipientsList(activity.bto)
            : []),
        ...(activity.bcc
            ? await deliveryService.getRecipientsList(activity.bcc)
            : []),
        ...(activity.audience
            ? await deliveryService.getRecipientsList(activity.audience)
            : []),
    ];
    const recipientInboxes = await Promise.all(recipients.map(async (recipient) => {
        if (recipient.toString() === actor.id?.toString()) {
            return null;
        }
        const foundThing = await databaseService.findEntityById(recipient);
        if (!foundThing) {
            return null;
        }
        if (typeof foundThing === 'object' &&
            'inbox' in foundThing &&
            foundThing.inbox) {
            return foundThing.inbox;
        }
    }));
    const recipientInboxIds = [];
    for (const recipientInbox of recipientInboxes) {
        if (recipientInbox instanceof URL) {
            recipientInboxIds.push(recipientInbox);
        }
    }
    return [...new Set(recipientInboxIds)];
}
exports.getRecipientInboxIds = getRecipientInboxIds;
//# sourceMappingURL=index.js.map