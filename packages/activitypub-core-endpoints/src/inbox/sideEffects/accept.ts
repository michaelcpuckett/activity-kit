import {
  AP,
  assertIsApActor,
  assertIsApEntity,
  assertIsApType,
  assertIsArray,
  assertExists,
} from 'activitypub-core-types';
import { getId, isType } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '..';

// A Follow request has been accepted.
export async function handleAccept(
  this: InboxPostEndpoint,
  activity: AP.Entity,
  recipient: AP.Actor,
) {
  assertIsApType<AP.Accept>(activity, AP.ActivityTypes.ACCEPT);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const object = await this.layers.data.findEntityById(objectId);

  assertIsApEntity(object);

  if (!isType(object, AP.ActivityTypes.FOLLOW)) {
    return;
  }

  const followActivity = object;

  assertIsApType<AP.Follow>(followActivity, AP.ActivityTypes.FOLLOW);

  const followerId = getId(followActivity.actor);

  assertExists(followerId);

  if (followerId.toString() !== getId(recipient)?.toString()) {
    // Not applicable to this Actor.
    return;
  }

  const follower = await this.layers.data.queryById(followerId);

  assertIsApActor(follower);

  const followeeId = getId(followActivity.object);

  assertExists(followeeId);

  const followee = await this.layers.data.queryById(followeeId);

  assertIsApActor(followee);

  const followingId = getId(follower.following);

  assertExists(followingId);

  const following = await this.layers.data.queryById(followingId);

  assertIsApType<AP.Collection>(following, AP.CollectionTypes.COLLECTION);
  assertIsArray(following.items);

  // Already following.
  if (
    following.items
      .map((item: AP.EntityReference) => getId(item)?.toString())
      .includes(followeeId.toString())
  ) {
    console.log('Already following.');
    return;
  }

  await this.layers.data.insertItem(followingId, followeeId);
}
