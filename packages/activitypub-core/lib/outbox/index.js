"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outboxHandler = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const entity_1 = require("../entity");
const delete_1 = require("./delete");
const create_1 = require("./create");
const update_1 = require("./update");
const like_1 = require("./like");
const announce_1 = require("./announce");
const add_1 = require("./add");
const undo_1 = require("./undo");
const remove_1 = require("./remove");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const activitypub_core_utilities_4 = require("activitypub-core-utilities");
const activitypub_core_utilities_5 = require("activitypub-core-utilities");
const activitypub_core_utilities_6 = require("activitypub-core-utilities");
async function outboxHandler(req, res, serviceAccount, databaseService, deliveryService) {
    if (!req) {
        throw new Error('No request object.');
    }
    if (req.method === 'POST') {
        return await handleOutboxPost(req, res, databaseService, deliveryService);
    }
    return await (0, entity_1.entityGetHandler)(req, res, serviceAccount, databaseService);
}
exports.outboxHandler = outboxHandler;
async function handleOutboxPost(req, res, databaseService, deliveryService) {
    if (!req || !res) {
        throw new Error('No response object.');
    }
    const url = `${activitypub_core_utilities_1.LOCAL_DOMAIN}${req.url}`;
    try {
        const initiator = await databaseService.findOne('actor', {
            outbox: url,
        });
        if (!initiator || !initiator.id || !('outbox' in initiator)) {
            throw new Error('No actor with this outbox.');
        }
        const initiatorOutboxId = new URL(url);
        const entity = await (0, activitypub_core_utilities_5.parseStream)(req);
        if (!entity) {
            throw new Error('bad JSONLD?');
        }
        const activity = (0, activitypub_core_utilities_4.combineAddresses)(entity);
        const activityId = new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}/activity/${(0, activitypub_core_utilities_2.getGuid)()}`);
        activity.id = activityId;
        if ('object' in activity) {
            const objectId = (0, activitypub_core_utilities_3.getId)(activity.object);
            if (objectId) {
                const remoteObject = await databaseService.queryById(objectId);
                if (!remoteObject) {
                    throw new Error('Remote object does not exist!');
                }
            }
        }
        switch (activity.type) {
            case activitypub_core_types_1.AP.ActivityTypes.CREATE:
                activity.object = await (0, create_1.handleCreate)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.DELETE:
                await (0, delete_1.handleDelete)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.UPDATE:
                await (0, update_1.handleUpdate)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.LIKE:
                await (0, like_1.handleLike)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE:
                await (0, announce_1.handleAnnounce)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.ADD:
                await (0, add_1.handleAdd)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.REMOVE:
                await (0, remove_1.handleRemove)(activity, databaseService);
                break;
            case activitypub_core_types_1.AP.ActivityTypes.UNDO:
                await (0, undo_1.handleUndo)(activity, databaseService, initiator);
                break;
        }
        const saveActivity = async (activityToSave) => {
            const activityToSaveId = activityToSave.id;
            if (!activityToSaveId) {
                throw new Error('No Activity ID');
            }
            activityToSave.url = activityToSaveId;
            const publishedDate = new Date();
            activityToSave.published = publishedDate;
            const activityReplies = {
                "@context": new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
                id: new URL(`${activityToSaveId.toString()}/replies`),
                url: new URL(`${activityToSaveId.toString()}/replies`),
                name: 'Replies',
                type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
                totalItems: 0,
                items: [],
                published: publishedDate,
            };
            const activityLikes = {
                "@context": new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
                id: new URL(`${activityToSaveId.toString()}/likes`),
                url: new URL(`${activityToSaveId.toString()}/likes`),
                name: 'Likes',
                type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
                totalItems: 0,
                orderedItems: [],
                published: publishedDate,
            };
            const activityShares = {
                "@context": new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
                id: new URL(`${activityToSaveId.toString()}/shares`),
                url: new URL(`${activityToSaveId.toString()}/shares`),
                name: 'Shares',
                type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
                totalItems: 0,
                orderedItems: [],
                published: publishedDate,
            };
            activityToSave.replies = activityReplies.id;
            activityToSave.likes = activityLikes.id;
            activityToSave.shares = activityShares.id;
            await Promise.all([
                databaseService.saveEntity(activityToSave),
                databaseService.saveEntity(activityReplies),
                databaseService.saveEntity(activityLikes),
                databaseService.saveEntity(activityShares),
            ]);
            await databaseService.insertOrderedItem(initiatorOutboxId, activityToSaveId);
            await deliveryService.broadcast(activityToSave, initiator);
            res.statusCode = 201;
            if (activityToSave.id) {
                res.setHeader('Location', activityToSave.id.toString());
            }
            res.write((0, activitypub_core_utilities_6.stringifyWithContext)(activityToSave));
            res.end();
            return {
                props: {},
            };
        };
        for (const type of Object.values(activitypub_core_types_1.AP.ActivityTypes)) {
            if (type === activity.type) {
                return await saveActivity(activity);
            }
        }
        const convertedActivity = {
            id: activityId,
            url: activityId,
            type: activitypub_core_types_1.AP.ActivityTypes.CREATE,
            actor: initiator.id,
            object: activity,
        };
        convertedActivity.object = await (0, create_1.handleCreate)(convertedActivity, databaseService);
        return await saveActivity(convertedActivity);
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