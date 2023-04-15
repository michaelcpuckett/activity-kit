import { OutboxPostEndpoint } from '..';
import { getId, isType } from 'activitypub-core-utilities';
import {
  AP,
  assertIsApCollection,
  assertIsApType,
} from 'activitypub-core-types';

export async function handleRemove(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Remove>(activity, AP.ActivityTypes.REMOVE);

  const objectId = getId(activity.object);
  const targetId = getId(activity.target);
  const target = await this.layers.data.findEntityById(targetId);

  assertIsApCollection(target);

  if (target.attributedTo) {
    const actorId = getId(activity.actor);
    const attributedToId = getId(target.attributedTo);

    if (attributedToId?.toString() !== actorId?.toString()) {
      throw new Error('Not allowed.');
    }
  }

  if (isType(target, AP.CollectionTypes.ORDERED_COLLECTION)) {
    await this.layers.data.removeOrderedItem(targetId, objectId);
  } else if (isType(target, AP.CollectionTypes.COLLECTION)) {
    await this.layers.data.removeItem(targetId, objectId);
  } else {
    throw new Error('Bad target: Not a collection.');
  }
}
