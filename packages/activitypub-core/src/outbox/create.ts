import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT, getTypedEntity } from 'activitypub-core-utilities';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { getGuid } from 'activitypub-core-utilities';
import type { Database } from 'activitypub-core-types';

/**
 * Create
 * [x] Merges audience properties (to, bto, cc, bcc, audience) with the Create’s
 *    object’s audience properties (outbox:create:merges-audience-properties)
 *    SHOULD
 * [x] Create’s actor property is copied to be the value of .object.attributedTo
 *    (outbox:create:actor-to-attributed-to) SHOULD
 */

export async function handleCreate(
  activity: AP.Create | AP.Delete,
  databaseService: Database,
) {
  if (
    !activity.object ||
    activity.object instanceof URL ||
    Array.isArray(activity.object)
  ) {
    throw new Error('bad request 1');
  }

  const object = getTypedEntity(activity.object);

  if (!object) {
    throw new Error('Bad request. 2');
  }

  const objectId = `${LOCAL_DOMAIN}/object/${getGuid()}`;

  object.id = new URL(objectId);

  if ('url' in object) {
    object.url = new URL(objectId);
  }

  const publishedDate = new Date();

  const objectReplies: AP.Collection = {
    "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${object.id.toString()}/replies`),
    url: new URL(`${object.id.toString()}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    published: publishedDate,
  };

  const objectLikes: AP.OrderedCollection = {
    "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${object.id.toString()}/likes`),
    url: new URL(`${object.id.toString()}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const objectShares: AP.OrderedCollection = {
    "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${object.id.toString()}/shares`),
    url: new URL(`${object.id.toString()}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  if (!('id' in object) || !object.id) {
    throw new Error('Bad request 4');
  }

  for (const type of Object.values(AP.CoreObjectTypes)) {
    if (type === object.type) {
      object.attributedTo = activity.actor;
      object.replies = objectReplies;
      object.likes = objectLikes;
      object.shares = objectShares;
      object.published = new Date();
      object.attributedTo = activity.actor;
      object.published = publishedDate;

      await Promise.all([
        databaseService.saveEntity(object),
        databaseService.saveEntity(objectReplies),
        databaseService.saveEntity(objectLikes),
        databaseService.saveEntity(objectShares),
      ]);

      return object.id;
    }
  }

  // Link case.
  await Promise.all([databaseService.saveEntity(object)]);

  return object.id;
}