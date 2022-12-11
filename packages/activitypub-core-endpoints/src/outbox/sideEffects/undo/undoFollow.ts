import { getId } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoFollow(
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

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.db.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  await Promise.all([
    this.adapters.db.removeItem(getId(actor.following), objectId),
  ]);
}
