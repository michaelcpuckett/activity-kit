import { OutboxPostHandler } from '..';
import { getId } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

export async function handleAdd(this: OutboxPostHandler, activity?: AP.Entity) {
  activity = activity || this.activity;

  if (!('object' in activity) || !('target' in activity)) {
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
  const target = await this.databaseService.findEntityById(targetId);

  if (!target) {
    throw new Error('Bad target: not found, only local allowed.');
  }

  // TODO: Check if actor "owns" this collection.

  if ('orderedItems' in target && Array.isArray(target.orderedItems)) {
    await this.databaseService.insertOrderedItem(targetId, objectId);
  } else if ('items' in target && Array.isArray(target.items)) {
    await this.databaseService.insertItem(targetId, objectId);
  } else {
    throw new Error('Bad target: not a collection.');
  }
}
