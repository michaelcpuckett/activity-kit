import { OutboxPostEndpoint } from '.';
import { AP } from 'activitypub-core-types';
import { getId, ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';

export async function saveActivity(this: OutboxPostEndpoint) {
  if (!this.activity) {
    throw new Error('No activity.');
  }

  const publishedDate = new Date();
  (this.activity as AP.Activity).published = publishedDate;
  const activityId = this.activity.id;

  // Attach replies, likes, and shares.

  const replies: AP.Collection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${activityId.toString()}/replies`),
    url: new URL(`${activityId.toString()}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    published: publishedDate,
  };

  const likes: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${activityId.toString()}/likes`),
    url: new URL(`${activityId.toString()}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const shares: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${activityId.toString()}/shares`),
    url: new URL(`${activityId.toString()}/shares`),
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  if (replies.id instanceof URL) {
    (this.activity as AP.Activity).replies = replies.id;
  }

  if (likes.id instanceof URL) {
    (this.activity as AP.Activity).likes = likes.id;
  }

  if (shares.id instanceof URL) {
    (this.activity as AP.Activity).shares = shares.id;
  }

  await Promise.all([
    this.adapters.db.saveEntity(this.activity),
    this.adapters.db.saveEntity(replies),
    this.adapters.db.saveEntity(likes),
    this.adapters.db.saveEntity(shares),
    this.adapters.db.insertOrderedItem(getId(this.actor?.outbox), activityId),
  ]);
}
