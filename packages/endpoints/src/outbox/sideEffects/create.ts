import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import { LOCAL_DOMAIN, applyContext, getId } from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';

import { OutboxPostEndpoint } from '..';

export async function handleCreate(
  this: OutboxPostEndpoint,
  activity: AP.Create,
) {
  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const object = activity.object;

  if (object instanceof URL) {
    throw new Error('Bad object: URL reference is not allowed for Create.');
  }

  if (Array.isArray(object)) {
    throw new Error(
      'Internal error: Object array not supported currently. TODO.',
    );
  }

  assert.isApEntity(object);

  const publishedDate = new Date();

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [{ value: month }, , { value: day }, , { value: year }] =
    dateFormatter.formatToParts(publishedDate);

  const type = Array.isArray(object.type) ? object.type[0] : object.type;

  const objectId = new URL(
    `${LOCAL_DOMAIN}${compile(this.routes[type.toLowerCase()])({
      guid: await this.core.getGuid(),
      year,
      month,
      day,
    })}`,
  );

  object.id = objectId;

  if (guard.isApExtendedObject(object)) {
    object.url = objectId;

    const entityRoute = objectId.pathname;

    const objectRepliesId = new URL(
      `${LOCAL_DOMAIN}${compile(this.routes.replies, {
        validate: false,
      })({
        entityRoute,
      })}`,
    );

    const objectReplies = applyContext<AP.OrderedCollection>({
      id: objectRepliesId,
      url: objectRepliesId,
      name: 'Replies',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
      attributedTo: actorId,
    });

    const objectLikesId = new URL(
      `${LOCAL_DOMAIN}${compile(this.routes.likes, {
        validate: false,
      })({
        entityRoute,
      })}`,
    );

    const objectLikes = applyContext<AP.OrderedCollection>({
      id: objectLikesId,
      url: objectLikesId,
      name: 'Likes',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
      attributedTo: actorId,
    });

    const objectSharesId = new URL(
      `${LOCAL_DOMAIN}${compile(this.routes.shares, {
        validate: false,
      })({
        entityRoute,
      })}`,
    );

    const objectShares = applyContext<AP.OrderedCollection>({
      id: objectSharesId,
      url: objectSharesId,
      name: 'Shares',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
      attributedTo: actorId,
    });

    object.attributedTo = actorId;
    object.replies = objectRepliesId;
    object.likes = objectLikesId;
    object.shares = objectSharesId;
    object.published = publishedDate;

    if (object.inReplyTo) {
      const inReplyToId = getId(object.inReplyTo);

      assert.exists(inReplyToId);

      const objectInReplyTo = await this.core.findEntityById(inReplyToId);

      if (objectInReplyTo && 'replies' in objectInReplyTo) {
        const repliesCollectionId = getId(objectInReplyTo.replies);

        if (repliesCollectionId) {
          await this.core.insertOrderedItem(repliesCollectionId, objectId);
        }
      }
    }

    await Promise.all([
      this.core.saveEntity(object),
      this.core.saveEntity(objectReplies),
      this.core.saveEntity(objectLikes),
      this.core.saveEntity(objectShares),
    ]);
  } else {
    await this.core.saveEntity(object);
  }

  assert.isApType<AP.Create>(this.activity, AP.ActivityTypes.CREATE);

  // Attach the object to the activity that will be saved.
  this.activity.object = object;
}
