import {
  AP,
  Plugin,
  Library,
  Routes,
  assertExists,
  assertIsApCollection,
  assertIsApExtendedObject,
  assertIsApType,
  assertIsArray,
} from 'activitypub-core-types';
import {
  getId,
  isLocal,
  LOCAL_DOMAIN,
  isType,
  PUBLIC_ACTOR,
} from 'activitypub-core-utilities';
import * as cheerio from 'cheerio';
import { compile } from 'path-to-regexp';

// Groups automatically announce activities addressed to them if sent from non-blocked followers.

export function GroupsPlugin() {
  const groupsPlugin: Plugin = {
    async handleInboxSideEffect(
      this: {
        lib: Library;
        routes: Routes;
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

      const object = await this.lib.queryById(objectId);

      assertIsApExtendedObject(object);

      const objectToBeSharedId = await (async (): Promise<URL> => {
        if (object.inReplyTo) {
          if (object.content) {
            const textContent = cheerio.load(object.content).text();
            const groupTag = `@${recipient.preferredUsername}`;

            if (textContent === groupTag) {
              const inReplyToId = getId(object.inReplyTo);

              if (inReplyToId) {
                return inReplyToId;
              }
            }
          }
        }

        return objectId;
      })();

      const hasAlreadyBeenShared = await (async (): Promise<boolean> => {
        const shared = await this.lib.getStreamByName(recipient, 'Shared');

        assertIsApType<AP.OrderedCollection>(
          shared,
          AP.CollectionTypes.ORDERED_COLLECTION,
        );

        const sharedItems = shared.orderedItems;

        assertIsArray(sharedItems);

        for (const sharedItem of sharedItems) {
          try {
            const sharedItemId = getId(sharedItem);

            assertExists(sharedItemId);

            const foundSharedItem = await this.lib.findEntityById(sharedItemId);

            assertIsApType<AP.Announce>(
              foundSharedItem,
              AP.ActivityTypes.ANNOUNCE,
            );

            const sharedItemObjectId = getId(foundSharedItem.object);

            assertExists(sharedItemObjectId);

            if (
              sharedItemObjectId.toString() === objectToBeSharedId.toString()
            ) {
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

      const followersCollection = await this.lib.findEntityById(followersId);

      assertIsApCollection(followersCollection);
      assertIsArray(followersCollection.items);

      const actorId = getId(activity.actor);

      assertExists(actorId);

      if (
        !followersCollection.items
          .map((id) => id.toString())
          .includes(actorId.toString())
      ) {
        // The actor is not a follower.
        return;
      }

      // We're in outbox, because this is auto-generated:

      const publishedDate = new Date();

      const announceActivityId = new URL(
        `${LOCAL_DOMAIN}${compile(this.routes.announce, {
          validate: false,
        })({
          guid: await this.lib.getGuid(),
        })}`,
      );

      const shared = await this.lib.getStreamByName(recipient, 'Shared');

      assertIsApCollection(shared);

      const sharedId = getId(shared);

      assertExists(sharedId);

      const announceActivity: AP.Announce = {
        id: announceActivityId,
        url: announceActivityId,
        type: AP.ActivityTypes.ANNOUNCE,
        actor: recipientId,
        to: [new URL(PUBLIC_ACTOR), followersId],
        object: objectToBeSharedId,
        published: publishedDate,
      };

      await this.lib.insertOrderedItem(sharedId, announceActivityId);

      if (isLocal(objectToBeSharedId)) {
        const object = await this.lib.findEntityById(objectId);

        assertIsApExtendedObject(object);

        const sharesId = getId(object.shares);

        assertExists(sharesId);

        await this.lib.insertOrderedItem(sharesId, announceActivityId);
      }

      const outboxId = getId(recipient.outbox);

      assertExists(outboxId);

      await Promise.all([
        this.lib.saveEntity(announceActivity),
        this.lib.insertOrderedItem(outboxId, announceActivityId),
      ]);

      await this.lib.broadcast(announceActivity, recipient);
    },
  };

  return groupsPlugin;
}
