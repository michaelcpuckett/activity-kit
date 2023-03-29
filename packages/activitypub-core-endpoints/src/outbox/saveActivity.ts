import { OutboxPostEndpoint } from '.';
import { AP, assertExists, assertIsApActivity } from 'activitypub-core-types';
import {
  getId,
  ACTIVITYSTREAMS_CONTEXT,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { compile } from 'path-to-regexp';

export async function saveActivity(this: OutboxPostEndpoint) {
  assertIsApActivity(this.activity);

  const publishedDate = new Date();
  this.activity.published = publishedDate;

  const activityId = getId(this.activity);

  assertExists(activityId);

  const actorId = getId(this.activity.actor);

  assertExists(actorId);

  // Attach replies, likes, and shares.

  const entityRoute = activityId.pathname;

  const repliesId = new URL(
    `${LOCAL_DOMAIN}${compile(this.routes.replies, {
      validate: false,
    })({
      entityRoute,
    })}`,
  );

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

  const likesId = new URL(
    `${LOCAL_DOMAIN}${compile(this.routes.likes, {
      validate: false,
    })({
      entityRoute,
    })}`,
  );

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

  const sharesId = new URL(
    `${LOCAL_DOMAIN}${compile(this.routes.shares, {
      validate: false,
    })({
      entityRoute,
    })}`,
  );

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
