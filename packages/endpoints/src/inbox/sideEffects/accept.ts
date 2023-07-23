import { guard, assert } from '@activity-kit/type-utilities';
import * as AP from '@activity-kit/types';
import { getId } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '..';

// A Follow request has been accepted.
export async function handleAccept(
  this: InboxPostEndpoint,
  activity: AP.Entity,
  recipient: AP.Actor,
) {
  assert.isApType<AP.Accept>(activity, AP.ActivityTypes.ACCEPT);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  const object = await this.core.queryById(objectId);

  assert.isApEntity(object);

  if (!guard.isType<AP.Follow>(object, AP.ActivityTypes.FOLLOW)) {
    return;
  }

  const followActivity = object;

  assert.isApType<AP.Follow>(followActivity, AP.ActivityTypes.FOLLOW);

  const followerId = getId(followActivity.actor);

  assert.exists(followerId);

  if (followerId.toString() !== getId(recipient)?.toString()) {
    // Not applicable to this Actor.
    return;
  }

  const follower = await this.core.queryById(followerId);

  assert.isApActor(follower);

  const followeeId = getId(followActivity.object);

  assert.exists(followeeId);

  const followee = await this.core.queryById(followeeId);

  assert.isApActor(followee);

  const followingId = getId(follower.following);

  assert.exists(followingId);

  const following = await this.core.queryById(followingId);

  assert.isApType<AP.Collection>(following, AP.CollectionTypes.COLLECTION);
  assert.isArray(following.items);

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

  const requests = await this.core.getStreamByName(follower, 'Requests');
  const requestsId = getId(requests);

  await this.core.removeItem(requestsId, getId(followActivity));
}
