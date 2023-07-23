import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleRemove(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assert.isApType<AP.Remove>(activity, AP.ActivityTypes.REMOVE);

  const objectId = getId(activity.object);
  const targetId = getId(activity.target);
  const target = await this.core.findEntityById(targetId);

  assert.isApCollection(target);

  if (target.attributedTo) {
    const actorId = getId(activity.actor);
    const attributedToId = getId(target.attributedTo);

    if (attributedToId?.toString() !== actorId?.toString()) {
      throw new Error('Not allowed.');
    }
  }

  if (
    Array.isArray(target.type)
      ? target.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
      : target.type === AP.CollectionTypes.ORDERED_COLLECTION
  ) {
    await this.core.removeOrderedItem(targetId, objectId);
  } else if (
    Array.isArray(target.type)
      ? target.type.includes(AP.CollectionTypes.COLLECTION)
      : target.type === AP.CollectionTypes.COLLECTION
  ) {
    await this.core.removeItem(targetId, objectId);
  } else {
    throw new Error('Bad target: Not a collection.');
  }
}
