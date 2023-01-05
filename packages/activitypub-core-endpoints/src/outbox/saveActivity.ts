import { OutboxPostEndpoint } from '.';
import { AP, assertExists, assertIsApActivity } from 'activitypub-core-types';
import { getId, ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';

export async function saveActivity(this: OutboxPostEndpoint) {
  assertIsApActivity(this.activity);

  const publishedDate = new Date();
  this.activity.published = publishedDate;

  const activityId = getId(this.activity);

  assertExists(activityId);

  const actorId = getId(this.activity.actor);

  assertExists(actorId);

  // Attach replies, likes, and shares.

  const repliesId = new URL(`${activityId.toString()}/replies`);
  const replies: AP.Collection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: repliesId,
    url: repliesId,
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    attributedTo: actorId,
    published: publishedDate,
  };

  const likesId = new URL(`${activityId.toString()}/likes`);
  const likes: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: likesId,
    url: likesId,
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    attributedTo: actorId,
    published: publishedDate,
  };

  const sharesId = new URL(`${activityId.toString()}/shares`);
  const shares: AP.OrderedCollection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: sharesId,
    url: sharesId,
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    attributedTo: actorId,
    published: publishedDate,
  };

  this.activity.replies = repliesId;
  this.activity.likes = likesId;
  this.activity.shares = sharesId;

  const outboxId = getId(this.actor.outbox);

  assertExists(outboxId);

  await Promise.all([
    this.adapters.db.saveEntity(this.activity),
    this.adapters.db.saveEntity(replies),
    this.adapters.db.saveEntity(likes),
    this.adapters.db.saveEntity(shares),
    this.adapters.db.insertOrderedItem(outboxId, activityId),
  ]);
}
