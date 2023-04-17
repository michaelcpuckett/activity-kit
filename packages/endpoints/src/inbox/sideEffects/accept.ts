import {
  AP,
  isType,
  assertIsApActor,
  assertIsApEntity,
  assertIsApType,
  assertIsArray,
  assertExists,
} from '@activity-kit/types';
import { getId } from '@activity-kit/utilities';
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

  const object = await this.core.queryById(objectId);

  assertIsApEntity(object);

  if (!isType<AP.Follow>(object, AP.ActivityTypes.FOLLOW)) {
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

  const follower = await this.core.queryById(followerId);

  assertIsApActor(follower);

  const followeeId = getId(followActivity.object);

  assertExists(followeeId);

  const followee = await this.core.queryById(followeeId);

  assertIsApActor(followee);

  const followingId = getId(follower.following);

  assertExists(followingId);

  const following = await this.core.queryById(followingId);

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

  await this.core.insertItem(followingId, followeeId);
}
