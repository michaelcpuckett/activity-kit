import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApEntity,
  assertIsApType,
  assertIsArray,
} from 'activitypub-core-types';
import { isTypeOf } from 'activitypub-core-utilities';
import {
  ACTIVITYSTREAMS_CONTEXT,
  LOCAL_DOMAIN,
  PUBLIC_ACTOR,
} from 'activitypub-core-utilities';
import { getId } from 'activitypub-core-utilities';
import { compile } from 'path-to-regexp';
import { InboxPostEndpoint } from '..';

// A Follow request has been made to a local user.
export async function handleFollow(
  this: InboxPostEndpoint,
  activity: AP.Entity,
  recipient: AP.Actor,
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

  if (followeeId.toString() !== getId(recipient)?.toString()) {
    // Not applicable to this Actor.
    return;
  }

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
    const requests = await this.adapters.db.getStreamByName(
      followee,
      'Requests',
    );

    assertIsApType<AP.Collection>(requests, AP.CollectionTypes.COLLECTION);

    const requestsId = getId(requests);

    await this.adapters.db.insertItem(requestsId, activityId);

    return;
  }

  // Now we're in outbox, because this is auto-generated:

  const acceptActivityId = `${new URL(
    `${LOCAL_DOMAIN}${compile(this.routes.accept)({
      guid: await this.adapters.crypto.randomBytes(16),
    })}`,
  )}`;
  const publishedDate = new Date();

  const acceptActivity: AP.Accept = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(acceptActivityId),
    url: new URL(acceptActivityId),
    type: AP.ActivityTypes.ACCEPT,
    to: [new URL(PUBLIC_ACTOR), followerId],
    actor: followeeId,
    object: activityId,
    published: publishedDate,
  };

  const followeeOutboxId = getId(followee.outbox);

  assertExists(followeeOutboxId);

  await Promise.all([
    this.adapters.db.saveEntity(acceptActivity),
    this.adapters.db.insertOrderedItem(
      followeeOutboxId,
      new URL(acceptActivityId),
    ),
    this.adapters.db.insertItem(followersId, followerId),
  ]);

  await this.adapters.delivery.broadcast(acceptActivity, followee);
}
