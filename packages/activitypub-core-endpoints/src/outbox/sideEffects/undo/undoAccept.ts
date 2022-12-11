import { getId } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoAccept(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  if (!activity.id) {
    throw new Error('Bad activity: no ID.');
  }

  const actorId = getId((activity as AP.Activity).actor);

  if (!actorId) {
    throw new Error('Bad actor: no ID.');
  }

  const actor = await this.adapters.db.queryById(actorId);

  if (!actor || !('outbox' in actor)) {
    throw new Error('Bad actor: not found.');
  }

  const followId = getId(activity.object);

  if (!followId) {
    throw new Error('Bad follow object: no ID.');
  }

  const follow = await this.adapters.db.queryById(followId);

  if (!follow) {
    throw new Error('Bad follow object: not found.');
  }

  const followerId = getId(follow.actor);

  if (!followerId) {
    throw new Error('Bad follower: no ID.');
  }

  await Promise.all([
    this.adapters.db.removeItem(getId(actor.followers), followerId),
  ]);
}
