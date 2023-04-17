import { OutboxPostEndpoint } from '..';
import { getId } from '@activity-kit/utilities';
import { AP, assertIsApCollection, assertIsApType } from '@activity-kit/types';

export async function handleAdd(this: OutboxPostEndpoint, activity: AP.Entity) {
  assertIsApType<AP.Add>(activity, AP.ActivityTypes.ADD);

  const objectId = getId(activity.object);
  const targetId = getId(activity.target);
  const target = await this.core.findEntityById(targetId);

  assertIsApCollection(target);

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
    await this.core.insertOrderedItem(targetId, objectId);
  } else if (
    Array.isArray(target.type)
      ? target.type.includes(AP.CollectionTypes.COLLECTION)
      : target.type === AP.CollectionTypes.COLLECTION
  ) {
    await this.core.insertItem(targetId, objectId);
  } else {
    throw new Error('Bad target: Not a collection.');
  }
}
