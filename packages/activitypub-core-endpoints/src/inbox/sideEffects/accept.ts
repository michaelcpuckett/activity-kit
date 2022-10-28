import { AP } from 'activitypub-core-types';
import { getId, isTypeOf } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '..';

export async function handleAccept(this: InboxPostEndpoint) {
  const activity = this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.db.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (object.type !== AP.ActivityTypes.FOLLOW) {
    // Not applicable.
    return;
  }

  const followActivity: AP.Follow = object;
  const followerId = getId(followActivity.actor);

  if (!followerId) {
    throw new Error('Bad follower: no ID.');
  }

  const followeeId = getId(followActivity.object);

  if (!followerId) {
    throw new Error('Bad followee: no ID.');
  }

  const follower = await this.adapters.db.queryById(followerId);

  if (!follower) {
    throw new Error('Bad follower: not found.');
  }

  if (!isTypeOf(follower, AP.ActorTypes)) {
    throw new Error('Bad follower: not an actor.');
  }

  const followee = await this.adapters.db.queryById(followeeId);

  if (!followee) {
    throw new Error('Bad followee: not found.');
  }

  if (!('outbox' in followee)) {
    throw new Error('Bad followee: not an actor.');
  }

  const followeeFollowersId = getId(followee.followers);

  if (!followeeFollowersId) {
    throw new Error('Bad followee: No followers collection.');
  }

  const followerFollowingId = getId(follower.following);

  if (!followerFollowingId) {
    throw new Error('Bad followee: No following collection.');
  }

  await Promise.all([
    this.adapters.db.insertItem(followeeFollowersId, followerId),
    this.adapters.db.insertItem(followerFollowingId, followeeId),
  ]);
}
