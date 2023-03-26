import { OutboxPostEndpoint } from '..';
import {
  AP,
  assertExists,
  assertIsApEntity,
  assertIsApExtendedObject,
  assertIsApType,
} from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT, isTypeOf } from 'activitypub-core-utilities';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { getId, getGuid } from 'activitypub-core-utilities';

export async function handleCreate(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Create>(activity, AP.ActivityTypes.CREATE);

  const actorId = getId(activity.actor);

  assertExists(actorId);

  const object = activity.object;

  if (object instanceof URL) {
    throw new Error('Bad object: URL reference is not allowed for Create.');
  }

  if (Array.isArray(object)) {
    throw new Error(
      'Internal error: Object array not supported currently. TODO.',
    );
  }

  assertIsApEntity(object);

  let objectId = `${LOCAL_DOMAIN}/entity/${getGuid()}`;

  if (this.plugins && isTypeOf(object, AP.ExtendedObjectTypes)) {
    assertIsApExtendedObject(object);

    for (const plugin of this.plugins) {
      if ('generateObjectId' in plugin) {
        const pluginObjectId = plugin.generateObjectId(object);

        if (pluginObjectId) {
          objectId = pluginObjectId;
        }
      }
    }
  }

  object.id = new URL(objectId);

  if (isTypeOf(object, AP.ExtendedObjectTypes)) {
    assertIsApExtendedObject(object);

    object.url = new URL(objectId);

    const publishedDate = new Date();

    const objectRepliesId = new URL(`${objectId.toString()}/replies`);
    const objectReplies: AP.Collection = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: objectRepliesId,
      url: objectRepliesId,
      name: 'Replies',
      type: AP.CollectionTypes.COLLECTION,
      totalItems: 0,
      items: [],
      published: publishedDate,
      attributedTo: actorId,
    };

    const objectLikesId = new URL(`${objectId.toString()}/likes`);
    const objectLikes: AP.OrderedCollection = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: objectLikesId,
      url: objectLikesId,
      name: 'Likes',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
      attributedTo: actorId,
    };

    const objectSharesId = new URL(`${objectId.toString()}/shares`);
    const objectShares: AP.OrderedCollection = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: objectSharesId,
      url: objectSharesId,
      name: 'Shares',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
      attributedTo: actorId,
    };

    object.attributedTo = actorId;
    object.replies = objectRepliesId;
    object.likes = objectLikesId;
    object.shares = objectSharesId;
    object.published = publishedDate;

    await Promise.all([
      this.adapters.db.saveEntity(object),
      this.adapters.db.saveEntity(objectReplies),
      this.adapters.db.saveEntity(objectLikes),
      this.adapters.db.saveEntity(objectShares),
    ]);

    if (object.inReplyTo) {
      const objectInReplyTo = await this.adapters.db.findEntityById(
        getId(object.inReplyTo),
      );

      if (objectInReplyTo && 'replies' in objectInReplyTo) {
        const repliesCollectionId = getId(objectInReplyTo.replies);

        if (repliesCollectionId) {
          await this.adapters.db.insertOrderedItem(
            repliesCollectionId,
            new URL(objectId),
          );
        }
      }
    }
  } else {
    await this.adapters.db.saveEntity(object);
  }

  activity.object = object;
}
