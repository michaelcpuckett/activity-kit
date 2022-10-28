import { OutboxPostEndpoint } from '..';
import { getId } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

/**
 * [x] Remove object from the target Collection, unless not allowed due to
 * requirements in 7.5 (outbox:remove:removes-from-target) SHOULD
 */

export async function handleRemove(
  this: OutboxPostEndpoint,
  activity?: AP.Entity,
) {
  activity = activity || this.activity;

  if (!('object' in activity) || !('target' in activity)) {
    console.log(activity);
    throw new Error('Bad activity: no object / target.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  if (!activity.target) {
    throw new Error('Bad activity: must have target.');
  }

  const targetId = getId(activity.target);

  if (!targetId) {
    throw new Error('Bad target: no ID.');
  }

  // Only find local targets
  const target = await this.adapters.database.findEntityById(targetId);

  if (!target) {
    throw new Error('Bad target: not found.');
  }

  // TODO: Check if actor "owns" this collection.

  if ('orderedItems' in target && Array.isArray(target.orderedItems)) {
    await this.adapters.database.removeOrderedItem(targetId, objectId);
  } else if ('items' in target && Array.isArray(target.items)) {
    await this.adapters.database.removeItem(targetId, objectId);
  } else {
    throw new Error('Bad target: not a collection.');
  }
}
