"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsPlugin = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const cheerio = __importStar(require("cheerio"));
const path_to_regexp_1 = require("path-to-regexp");
function GroupsPlugin() {
    const groupsPlugin = {
        async handleInboxSideEffect(activity, recipient) {
            if (!(0, utilities_1.isType)(activity, types_1.AP.ActivityTypes.CREATE)) {
                return;
            }
            (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.CREATE);
            if (!(0, utilities_1.isType)(recipient, types_1.AP.ActorTypes.GROUP)) {
                return;
            }
            const objectId = (0, utilities_1.getId)(activity.object);
            (0, types_1.assertExists)(objectId);
            const object = await this.core.queryById(objectId);
            (0, types_1.assertIsApExtendedObject)(object);
            const objectToBeSharedId = await (async () => {
                if (object.inReplyTo) {
                    if (object.content) {
                        const textContent = cheerio.load(object.content).text();
                        const groupTag = `@${recipient.preferredUsername}`;
                        if (textContent === groupTag) {
                            const inReplyToId = (0, utilities_1.getId)(object.inReplyTo);
                            if (inReplyToId) {
                                return inReplyToId;
                            }
                        }
                    }
                }
                return objectId;
            })();
            const hasAlreadyBeenShared = await (async () => {
                const shared = await this.core.getStreamByName(recipient, 'Shared');
                (0, types_1.assertIsApType)(shared, types_1.AP.CollectionTypes.ORDERED_COLLECTION);
                const sharedItems = shared.orderedItems;
                (0, types_1.assertIsArray)(sharedItems);
                for (const sharedItem of sharedItems) {
                    try {
                        const sharedItemId = (0, utilities_1.getId)(sharedItem);
                        (0, types_1.assertExists)(sharedItemId);
                        const foundSharedItem = await this.core.findEntityById(sharedItemId);
                        (0, types_1.assertIsApType)(foundSharedItem, types_1.AP.ActivityTypes.ANNOUNCE);
                        const sharedItemObjectId = (0, utilities_1.getId)(foundSharedItem.object);
                        (0, types_1.assertExists)(sharedItemObjectId);
                        if (sharedItemObjectId.toString() === objectToBeSharedId.toString()) {
                            return true;
                        }
                    }
                    catch (error) {
                        break;
                    }
                }
                return false;
            })();
            if (hasAlreadyBeenShared) {
                return;
            }
            const recipientId = (0, utilities_1.getId)(recipient);
            (0, types_1.assertExists)(recipientId);
            const followersId = (0, utilities_1.getId)(recipient.followers);
            (0, types_1.assertExists)(followersId);
            const followersCollection = await this.core.findEntityById(followersId);
            (0, types_1.assertIsApCollection)(followersCollection);
            (0, types_1.assertIsArray)(followersCollection.items);
            const actorId = (0, utilities_1.getId)(activity.actor);
            (0, types_1.assertExists)(actorId);
            if (!followersCollection.items
                .map((id) => id.toString())
                .includes(actorId.toString())) {
                return;
            }
            const publishedDate = new Date();
            const announceActivityId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.announce, {
                validate: false,
            })({
                guid: await this.core.getGuid(),
            })}`);
            const shared = await this.core.getStreamByName(recipient, 'Shared');
            (0, types_1.assertIsApCollection)(shared);
            const sharedId = (0, utilities_1.getId)(shared);
            (0, types_1.assertExists)(sharedId);
            const announceActivity = {
                id: announceActivityId,
                url: announceActivityId,
                type: types_1.AP.ActivityTypes.ANNOUNCE,
                actor: recipientId,
                to: [new URL(utilities_1.PUBLIC_ACTOR), followersId],
                object: objectToBeSharedId,
                published: publishedDate,
            };
            await this.core.insertOrderedItem(sharedId, announceActivityId);
            if ((0, utilities_1.isLocal)(objectToBeSharedId)) {
                const object = await this.core.findEntityById(objectId);
                (0, types_1.assertIsApExtendedObject)(object);
                const sharesId = (0, utilities_1.getId)(object.shares);
                (0, types_1.assertExists)(sharesId);
                await this.core.insertOrderedItem(sharesId, announceActivityId);
            }
            const outboxId = (0, utilities_1.getId)(recipient.outbox);
            (0, types_1.assertExists)(outboxId);
            await Promise.all([
                this.core.saveEntity(announceActivity),
                this.core.insertOrderedItem(outboxId, announceActivityId),
            ]);
            await this.core.broadcast(announceActivity, recipient);
        },
    };
    return groupsPlugin;
}
exports.GroupsPlugin = GroupsPlugin;
//# sourceMappingURL=index.js.map