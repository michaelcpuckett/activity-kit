import { AP, assertExists, assertIsApCollection, assertIsApExtendedObject, assertIsApType, assertIsArray } from 'activitypub-core-types';
import type { DbAdapter, Plugin } from 'activitypub-core-types';
import { getId, getGuid, getCollectionNameByUrl, ACTIVITYSTREAMS_CONTEXT, LOCAL_DOMAIN, isType, PUBLIC_ACTOR } from 'activitypub-core-utilities';

// Groups automatically announce activities addressed to them if sent from non-blocked followers.

export function GroupsPlugin(config?: {}) {
  const groupsPlugin: Plugin = {
    async handleInboxSideEffect(
      this: {
        adapters: {
          db: DbAdapter;
          delivery: {
            broadcast: Function;
          };
        }
      }, 
      activity: AP.Activity,
      recipient: AP.Actor,
    ) {
      if (!isType(activity, AP.ActivityTypes.CREATE)) {
        return;
      }

      assertIsApType<AP.Create>(activity, AP.ActivityTypes.CREATE);

      if (!isType(recipient, AP.ActorTypes.GROUP)) {
        return;
      }

      const objectId = getId(activity.object);

      assertExists(objectId);

      const hasAlreadyBeenShared = await (async (): Promise<boolean> => {
        const shared = await this.adapters.db.getStreamByName(recipient, 'Shared');

        assertIsApType<AP.OrderedCollection>(shared, AP.CollectionTypes.ORDERED_COLLECTION);

        const sharedItems = shared.orderedItems;

        assertIsArray(sharedItems);

        for (const sharedItem of sharedItems) {
          try {
            const sharedItemId = getId(sharedItem);

            assertExists(sharedItemId);

            const foundSharedItem = await this.adapters.db.findEntityById(sharedItemId);

            assertIsApType<AP.Announce>(foundSharedItem, AP.ActivityTypes.ANNOUNCE);

            const sharedItemObjectId = getId(foundSharedItem.object);

            assertExists(sharedItemObjectId);

            if (sharedItemObjectId.toString() === objectId.toString()) {
              return true;
            }
          } catch (error) {
            break;
          }
        }
        
        return false;
      })();

      if (hasAlreadyBeenShared) {
        return;
      }

      const recipientId = getId(recipient);

      assertExists(recipientId);

      const followersId = getId(recipient.followers);

      assertExists(followersId);

      const followersCollection: AP.Collection = await this.adapters.db.findEntityById(followersId);

      assertIsApCollection(followersCollection);
      assertIsArray(followersCollection.items);

      const actorId = getId(activity.actor);

      assertExists(actorId);

      if (!followersCollection.items.map(id => id.toString()).includes(actorId.toString())) {
        // The actor is not a follower.
        return;
      }

      // We're in outbox, because this is auto-generated:

      const publishedDate = new Date();
      const announceActivityId = `${LOCAL_DOMAIN}/entity/${getGuid()}`;
      
      const shared = await this.adapters.db.getStreamByName(recipient, 'Shared');

      assertIsApCollection(shared);

      const sharedId = getId(shared);

      assertExists(sharedId);

      const announceActivityRepliesId = new URL(`${announceActivityId}/replies`);
      const announceActivityReplies: AP.Collection = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: announceActivityRepliesId,
        url: announceActivityRepliesId,
        name: 'Replies',
        type: AP.CollectionTypes.COLLECTION,
        attributedTo: recipientId,
        totalItems: 0,
        items: [],
        published: publishedDate,
      };

      const announceActivityLikesId = new URL(`${announceActivityId}/likes`);
      const announceActivityLikes = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: announceActivityLikesId,
        url: announceActivityLikesId,
        name: 'Likes',
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: recipientId,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
      };

      const announceActivitySharesId = new URL(`${announceActivityId}/shares`);
      const announceActivityShares = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: announceActivitySharesId,
        url: announceActivitySharesId,
        name: 'Shares',
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: recipientId,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
      };

      const announceActivity: AP.Announce = {
        id: new URL(announceActivityId),
        url: new URL(announceActivityId),
        type: AP.ActivityTypes.ANNOUNCE,
        actor: recipientId,
        to: [new URL(PUBLIC_ACTOR), followersId],
        object: objectId,
        replies: announceActivityRepliesId,
        likes: announceActivityLikesId,
        shares: announceActivitySharesId,
        published: publishedDate,
      };

      await this.adapters.db.insertOrderedItem(sharedId, new URL(announceActivityId));

      const isLocal = getCollectionNameByUrl(objectId) !== 'foreign-entity';

      if (isLocal) {
        const object = await this.adapters.db.findEntityById(objectId);

        assertIsApExtendedObject(object);

        const sharesId = getId(object.shares);

        assertExists(sharesId);

        await this.adapters.db.insertOrderedItem(sharesId, announceActivityId);
      }

      const outboxId = getId(recipient.outbox);

      assertExists(outboxId);

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
