import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT, getId } from 'activitypub-core-utilities';
import { UploadMediaPostEndpoint } from '.';

export async function saveActivity(this: UploadMediaPostEndpoint) {
  if (
    !this.activity ||
    !this.activity.id ||
    !this.activity.object ||
    this.activity.object instanceof URL ||
    Array.isArray(this.activity.object) ||
    !this.activity.object.id
  ) {
    throw new Error('Bad activity / bad object.');
  }

  const publishedDate = new Date();

  const objectReplies: AP.Collection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${this.activity.object.id.toString()}/replies`),
    url: new URL(`${this.activity.object.id.toString()}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    published: publishedDate,
  };

  const objectLikes: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${this.activity.object.id.toString()}/likes`),
    url: new URL(`${this.activity.object.id.toString()}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const objectShares: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${this.activity.object.id.toString()}/shares`),
    url: new URL(`${this.activity.object.id.toString()}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  if (objectLikes.id instanceof URL) {
    this.activity.object.likes = objectLikes.id;
  }

  if (objectShares.id instanceof URL) {
    this.activity.object.shares = objectShares.id;
  }

  if (objectReplies.id instanceof URL) {
    this.activity.object.replies = objectReplies.id;
  }

  this.activity.object.published = publishedDate;

  const activityReplies: AP.Collection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${this.activity.id.toString()}/replies`),
    url: new URL(`${this.activity.id.toString()}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    published: publishedDate,
  };

  const activityLikes: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${this.activity.id.toString()}/likes`),
    url: new URL(`${this.activity.id.toString()}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const activityShares: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${this.activity.id.toString()}/shares`),
    url: new URL(`${this.activity.id.toString()}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  if (activityLikes.id instanceof URL) {
    this.activity.likes = activityLikes.id;
  }

  if (activityShares.id instanceof URL) {
    this.activity.shares = activityShares.id;
  }

  if (activityReplies.id instanceof URL) {
    this.activity.replies = activityReplies.id;
  }

  this.activity.published = publishedDate;

  await Promise.all([
    this.adapters.database.saveEntity(objectReplies),
    this.adapters.database.saveEntity(objectLikes),
    this.adapters.database.saveEntity(objectShares),
    this.adapters.database.saveEntity(this.activity.object),
    this.adapters.database.saveEntity(activityReplies),
    this.adapters.database.saveEntity(activityLikes),
    this.adapters.database.saveEntity(activityShares),
    this.adapters.database.saveEntity(this.activity),
    this.adapters.database.insertOrderedItem(
      getId(this.actor?.outbox),
      this.activity.id,
    ),
  ]);
}
