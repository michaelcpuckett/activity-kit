import { AP } from 'activitypub-core-types';
import { getTypedEntity, isTypeOf } from 'activitypub-core-utilities';
import { getGuid } from 'activitypub-core-utilities';
import {
  ACTIVITYSTREAMS_CONTEXT,
  LOCAL_DOMAIN,
  PUBLIC_ACTOR,
} from 'activitypub-core-utilities';
import { getId } from 'activitypub-core-utilities';
import { InboxEndpoint } from '..';

export async function handleFollow(this: InboxEndpoint) {
  const activity = this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.databaseService.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (!isTypeOf(object, AP.ActorTypes)) {
    // Not applicable.
    return;
  }

  const actorId = getId(activity.actor);

  if (!actorId) {
    throw new Error('Bad activity: No actor.');
  }

  const actor = await this.databaseService.queryById(actorId);

  if (!actor) {
    throw new Error('Bad actor: Not found.');
  }

  if (!isTypeOf(actor, AP.ActorTypes)) {
    throw new Error('Bad actor: Type not recognized as an actor.');
  }

  const follower = actor;
  const followee = object;

  if (!(follower.id && followee.id)) {
    return;
  }

  // Now we're in outbox, because this is auto-generated:

  const acceptActivityId = `${LOCAL_DOMAIN}/activity/${getGuid()}`;
  const publishedDate = new Date();

  const acceptActivityReplies: AP.Collection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${acceptActivityId}/replies`),
    url: new URL(`${acceptActivityId}/replies`),
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    published: publishedDate,
  };

  const acceptActivityLikes = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${acceptActivityId}/likes`),
    url: new URL(`${acceptActivityId}/likes`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const acceptActivityShares = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: new URL(`${acceptActivityId}/shares`),
    url: new URL(`${acceptActivityId}/shares`),
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const acceptActivity: AP.Accept = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(acceptActivityId),
    url: new URL(acceptActivityId),
    type: AP.ActivityTypes.ACCEPT,
    to: [new URL(PUBLIC_ACTOR), follower.id],
    actor: followee.id,
    object: activity.id,
    replies: acceptActivityReplies.id,
    likes: acceptActivityLikes.id,
    shares: acceptActivityShares.id,
    published: publishedDate,
  };

  const followeeOutboxId = getId(followee.outbox);

  if (!followeeOutboxId) {
    throw new Error('Bad followee: No outbox ID.');
  }

  const followersId = getId(followee.followers);

  if (!followersId) {
    throw new Error('Bad followee: No followers ID.');
  }

  await Promise.all([
    this.databaseService.saveEntity(acceptActivity),
    this.databaseService.saveEntity(acceptActivityReplies),
    this.databaseService.saveEntity(acceptActivityLikes),
    this.databaseService.saveEntity(acceptActivityShares),
    this.databaseService.insertOrderedItem(followeeOutboxId, acceptActivity.id),
    this.databaseService.insertItem(followersId, follower.id),
  ]);

  await this.deliveryService.broadcast(acceptActivity, followee);
}
