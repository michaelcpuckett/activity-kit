import { OutboxPostEndpoint } from '..';
import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT, isTypeOf } from 'activitypub-core-utilities';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { getId, getGuid } from 'activitypub-core-utilities';

/**
 * Create
 * [x] Merges audience properties (to, bto, cc, bcc, audience) with the Create’s
 *    object’s audience properties (outbox:create:merges-audience-properties)
 *    SHOULD
 * [x] Create’s actor property is copied to be the value of .object.attributedTo
 *    (outbox:create:actor-to-attributed-to) SHOULD
 */

export async function handleCreate(this: OutboxPostEndpoint) {
  if (!('object' in this.activity)) {
    throw new Error('Bad activity: no object.');
  }

  const object = this.activity.object;

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (object instanceof URL) {
    throw new Error('Bad object: URL reference is not allowed for Create.');
  }

  if (Array.isArray(object)) {
    throw new Error(
      'Internal error: Object array not supported currently. TODO.',
    );
  }

  const objectId = `${LOCAL_DOMAIN}/entity/${getGuid()}`;

  object.id = new URL(objectId);

  if ('url' in object) {
    object.url = new URL(objectId);
  }

  const publishedDate = new Date();

  const objectReplies: AP.Collection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${object.id.toString()}/replies`),
    url: new URL(`${object.id.toString()}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    published: publishedDate,
  };

  const objectLikes: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${object.id.toString()}/likes`),
    url: new URL(`${object.id.toString()}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const objectShares: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${object.id.toString()}/shares`),
    url: new URL(`${object.id.toString()}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  if (isTypeOf(object, AP.CoreObjectTypes)) {
    const typedObject = object as AP.CoreObject;
    typedObject.attributedTo = (this.activity as AP.Activity).actor;
    typedObject.replies = objectReplies.id;
    typedObject.likes = objectLikes.id;
    typedObject.shares = objectShares.id;
    typedObject.attributedTo = (this.activity as AP.Activity).actor;
    typedObject.published = publishedDate;

    await Promise.all([
      this.adapters.db.saveEntity(object),
      this.adapters.db.saveEntity(objectReplies),
      this.adapters.db.saveEntity(objectLikes),
      this.adapters.db.saveEntity(objectShares),
    ]);

    if (typedObject.inReplyTo) {
      const objectInReplyTo = await this.adapters.db.findEntityById(
        getId(typedObject.inReplyTo),
      );

      if (objectInReplyTo) {
        const repliesCollectionId = getId(objectInReplyTo.replies);

        if (repliesCollectionId) {
          await this.adapters.db.insertOrderedItem(
            repliesCollectionId,
            typedObject.id,
          );
        }
      }
    }
  } else {
    // Link case.
    await Promise.all([this.adapters.db.saveEntity(object)]);
  }

  this.activity.object = object;
}
