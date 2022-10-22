import { OutboxPostHandler } from '..';
import { getId } from 'activitypub-core-utilities';

/**
 * [x] Remove object from the target Collection, unless not allowed due to
 * requirements in 7.5 (outbox:remove:removes-from-target) SHOULD
 */

export async function handleRemove(this: OutboxPostHandler) {
  if (!('object' in this.activity) || !('target' in this.activity)) {
    return;
  }

  const objectId = getId(this.activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  if (!this.activity.target) {
    throw new Error('Bad activity: must have target.');
  }

  const targetId = getId(this.activity.target);

  if (!targetId) {
    throw new Error('Bad target: no ID.');
  }

  // Only find local targets
  const target = await this.databaseService.findEntityById(targetId);

  if (!target) {
    throw new Error('Bad target: not found.');
  }

  // TODO: Check if actor "owns" this collection.

  if ('orderedItems' in target && Array.isArray(target.orderedItems)) {
    await this.databaseService.removeOrderedItem(targetId, objectId);
  } else if ('items' in target && Array.isArray(target.items)) {
    await this.databaseService.removeItem(targetId, objectId);
  } else {
    throw new Error('Bad target: not a collection.');
  }
}
