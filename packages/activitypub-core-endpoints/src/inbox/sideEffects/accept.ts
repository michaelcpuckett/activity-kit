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

  if (!isTypeOf(followee, AP.ActorTypes)) {
    throw new Error('Bad followee: not an actor.');
  }

  const followingId = getId(follower.following);

  if (!followingId) {
    throw new Error('Bad followee: No following collection.');
  }

  const following = await this.adapters.db.queryById(followingId);

  if (!following) {
    throw new Error('Bad followers collection: Not found.');
  }

  // Already following.
  if (following.items.map((id: URL) => id.toString()).includes(getId(followee).toString())) {
    console.log('NOTE: ALREADY FOLLOWING.');
    return;
  }

  await Promise.all([
    this.adapters.db.insertItem(followingId, followeeId),
  ]);
}
