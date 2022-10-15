import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import { getTypedEntity } from 'activitypub-core-utilities';
import { getGuid } from 'activitypub-core-utilities';
import {
  ACTIVITYSTREAMS_CONTEXT,
  LOCAL_DOMAIN,
  PUBLIC_ACTOR,
} from 'activitypub-core-utilities';
import { getId } from 'activitypub-core-utilities';
import { DeliveryService } from 'activitypub-core-delivery';

export async function handleFollow(
  activity: AP.Follow,
  databaseService: Database,
  deliveryService: DeliveryService,
): Promise<void> {
  if (!activity.id) {
    throw new Error('bad request');
  }

  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('No object id');
  }

  const foundObject = await databaseService.queryById(activityObjectId);

  if (!foundObject || !foundObject.type || !foundObject.id) {
    throw new Error('No found object');
  }

  const typedObject = getTypedEntity(foundObject);

  if (!typedObject || !('inbox' in typedObject)) {
    return;
  }

  const activityActorId = getId(activity.actor);

  if (!activityActorId) {
    throw new Error('Bad request 1');
  }

  const foundActor = await databaseService.queryById(activityActorId);

  if (!foundActor || !foundActor.type) {
    throw new Error('No actor found');
  }

  const typedActor = getTypedEntity(foundActor);

  if (!typedActor || !('inbox' in typedActor)) {
    throw new Error('actor not an actor?');
  }

  const follower = typedActor;
  const followee = typedObject;

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
    throw new Error('No followee Outbox ID');
  }

  const followeeFollowersId = getId(followee.followers);

  if (!followeeFollowersId) {
    throw new Error('no followee Followers ID');
  }

  if (!acceptActivity.id) {
    throw new Error('bad request');
  }

  await Promise.all([
    databaseService.saveEntity(acceptActivity),
    databaseService.saveEntity(acceptActivityReplies),
    databaseService.saveEntity(acceptActivityLikes),
    databaseService.saveEntity(acceptActivityShares),
    databaseService.insertOrderedItem(followeeOutboxId, acceptActivity.id),
    databaseService.insertItem(followeeFollowersId, follower.id),
  ]);

  await deliveryService.broadcast(acceptActivity, followee);
}
