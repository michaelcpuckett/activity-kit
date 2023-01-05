import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApEntity,
  assertIsApType,
  assertIsArray,
} from 'activitypub-core-types';
import { isTypeOf } from 'activitypub-core-utilities';
import { getGuid } from 'activitypub-core-utilities';
import {
  ACTIVITYSTREAMS_CONTEXT,
  LOCAL_DOMAIN,
  PUBLIC_ACTOR,
} from 'activitypub-core-utilities';
import { getId } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '..';

// A Follow request has been made to a local user.
export async function handleFollow(
  this: InboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Follow>(activity, AP.ActivityTypes.FOLLOW);

  const activityId = getId(activity);

  assertExists(activityId);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.adapters.db.queryById(objectId);

  assertIsApEntity(object);

  if (!isTypeOf(object, AP.ActorTypes)) {
    // Not applicable.
    return;
  }

  assertIsApActor(object);

  const actorId = getId(activity.actor);

  assertExists(actorId);

  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const follower = actor;
  const followerId = getId(follower);

  assertExists(followerId);

  const followee = object;
  const followeeId = getId(followee);

  assertExists(followeeId);

  const followersId = getId(followee.followers);

  assertExists(followersId);

  const followers = await this.adapters.db.findEntityById(followersId);

  assertIsApType<AP.Collection>(followers, AP.CollectionTypes.COLLECTION);
  assertIsArray(followers.items);

  // Already a follower.
  if (
    followers.items
      .map((id: AP.EntityReference) => id?.toString())
      .includes(followerId.toString())
  ) {
    console.log('Already a follower.');
    return;
  }

  if (followee.manuallyApprovesFollowers) {
    const requests = await this.adapters.db.getStreamByName(actor, 'Requests');

    assertIsApType<AP.Collection>(requests, AP.CollectionTypes.COLLECTION);

    const requestsId = getId(requests);

    await this.adapters.db.insertItem(requestsId, activityId);

    return;
  }

  // Now we're in outbox, because this is auto-generated:

  const acceptActivityId = `${LOCAL_DOMAIN}/entity/${getGuid()}`;
  const publishedDate = new Date();

  const acceptActivityRepliesId = new URL(`${acceptActivityId}/replies`);
  const acceptActivityReplies: AP.Collection = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: acceptActivityRepliesId,
    url: acceptActivityRepliesId,
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    published: publishedDate,
  };

  const acceptActivityLikesId = new URL(`${acceptActivityId}/likes`);
  const acceptActivityLikes = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: acceptActivityLikesId,
    url: acceptActivityLikesId,
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  };

  const acceptActivitySharesId = new URL(`${acceptActivityId}/shares`);
  const acceptActivityShares = {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    id: acceptActivitySharesId,
    url: acceptActivitySharesId,
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
    to: [new URL(PUBLIC_ACTOR), followerId],
    actor: followeeId,
    object: activityId,
    replies: acceptActivityRepliesId,
    likes: acceptActivityLikesId,
    shares: acceptActivitySharesId,
    published: publishedDate,
  };

  const followeeOutboxId = getId(followee.outbox);

  assertExists(followeeOutboxId);

  await Promise.all([
    this.adapters.db.saveEntity(acceptActivity),
    this.adapters.db.saveEntity(acceptActivityReplies),
    this.adapters.db.saveEntity(acceptActivityLikes),
    this.adapters.db.saveEntity(acceptActivityShares),
    this.adapters.db.insertOrderedItem(followeeOutboxId, acceptActivityId),
    this.adapters.db.insertItem(followersId, followerId),
  ]);

  await this.adapters.delivery.broadcast(acceptActivity, followee);
}
