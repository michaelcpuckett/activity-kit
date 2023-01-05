"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsPlugin = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
function GroupsPlugin(config) {
    const groupsPlugin = {
        async handleInboxSideEffect(activity, recipient) {
            (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.CREATE);
            if (!(0, activitypub_core_utilities_1.isType)(recipient, activitypub_core_types_1.AP.ActorTypes.GROUP)) {
                return;
            }
            const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
            (0, activitypub_core_types_1.assertExists)(objectId);
            const recipientId = (0, activitypub_core_utilities_1.getId)(recipient);
            (0, activitypub_core_types_1.assertExists)(recipientId);
            const followersId = (0, activitypub_core_utilities_1.getId)(recipient.followers);
            (0, activitypub_core_types_1.assertExists)(followersId);
            const followersCollection = await this.adapters.db.findEntityById(followersId);
            (0, activitypub_core_types_1.assertIsApCollection)(followersCollection);
            (0, activitypub_core_types_1.assertIsArray)(followersCollection.items);
            const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
            (0, activitypub_core_types_1.assertExists)(actorId);
            if (!followersCollection.items.map(id => id.toString()).includes(actorId.toString())) {
                return;
            }
            const publishedDate = new Date();
            const announceActivityId = `${activitypub_core_utilities_1.LOCAL_DOMAIN}/entity/${(0, activitypub_core_utilities_1.getGuid)()}`;
            const shared = await this.adapters.db.getStreamByName(recipient, 'Shared');
            (0, activitypub_core_types_1.assertIsApCollection)(shared);
            const sharedId = (0, activitypub_core_utilities_1.getId)(shared);
            (0, activitypub_core_types_1.assertExists)(sharedId);
            const announceActivityRepliesId = new URL(`${announceActivityId}/replies`);
            const announceActivityReplies = {
                '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
                id: announceActivityRepliesId,
                url: announceActivityRepliesId,
                name: 'Replies',
                type: activitypub_core_types_1.AP.CollectionTypes.COLLECTION,
                attributedTo: recipientId,
                totalItems: 0,
                items: [],
                published: publishedDate,
            };
            const announceActivityLikesId = new URL(`${announceActivityId}/likes`);
            const announceActivityLikes = {
                '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
                id: announceActivityLikesId,
                url: announceActivityLikesId,
                name: 'Likes',
                type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
                attributedTo: recipientId,
                totalItems: 0,
                orderedItems: [],
                published: publishedDate,
            };
            const announceActivitySharesId = new URL(`${announceActivityId}/shares`);
            const announceActivityShares = {
                '@context': new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
                id: announceActivitySharesId,
                url: announceActivitySharesId,
                name: 'Shares',
                type: activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
                attributedTo: recipientId,
                totalItems: 0,
                orderedItems: [],
                published: publishedDate,
            };
            const announceActivity = {
                id: new URL(announceActivityId),
                url: new URL(announceActivityId),
                type: activitypub_core_types_1.AP.ActivityTypes.ANNOUNCE,
                actor: recipientId,
                to: [new URL(activitypub_core_utilities_1.PUBLIC_ACTOR), followersId],
                object: objectId,
                replies: announceActivityRepliesId,
                likes: announceActivityLikesId,
                shares: announceActivitySharesId,
                published: publishedDate,
            };
            await this.adapters.db.insertOrderedItem(sharedId, new URL(announceActivityId));
            const isLocal = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(objectId) !== 'foreign-entity';
            if (isLocal) {
                const object = await this.adapters.db.findEntityById(objectId);
                (0, activitypub_core_types_1.assertIsApExtendedObject)(object);
                const sharesId = (0, activitypub_core_utilities_1.getId)(object.shares);
                (0, activitypub_core_types_1.assertExists)(sharesId);
                await this.adapters.db.insertOrderedItem(sharesId, announceActivityId);
            }
            const outboxId = (0, activitypub_core_utilities_1.getId)(recipient.outbox);
            (0, activitypub_core_types_1.assertExists)(outboxId);
            await Promise.all([
                this.adapters.db.saveEntity(announceActivity),
                this.adapters.db.saveEntity(announceActivityReplies),
                this.adapters.db.saveEntity(announceActivityLikes),
                this.adapters.db.saveEntity(announceActivityShares),
                this.adapters.db.insertOrderedItem(outboxId, announceActivityId),
            ]);
            await this.adapters.delivery.broadcast(announceActivity, recipient);
        }
    };
    return groupsPlugin;
}
exports.GroupsPlugin = GroupsPlugin;
//# sourceMappingURL=index.js.map