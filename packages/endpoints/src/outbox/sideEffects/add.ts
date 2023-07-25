import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { getId } from '@activity-kit/utilities';
import { assert, guard } from '@activity-kit/type-utilities';

export async function handleAdd(
  this: OutboxPostEndpoint,
  activity: AP.Add | AP.Remove,
) {
  const objectId = getId(activity.object);

  assert.exists(objectId);

  const targetId = getId(activity.target);

  assert.exists(targetId);

  const target = await this.core.findEntityById(targetId);

  assert.isApCollection(target);

  if (target.attributedTo) {
    const actorId = getId(activity.actor);

    assert.exists(actorId);

    const attributedToId = getId(target.attributedTo);

    assert.exists(attributedToId);

    if (attributedToId.href !== actorId.href) {
      throw new Error('Not allowed.');
    }
  }

  if (
    guard.isApType<AP.OrderedCollection>(
      target,
      AP.CollectionTypes.ORDERED_COLLECTION,
    )
  ) {
    await this.core.insertOrderedItem(targetId, objectId);
  } else {
    await this.core.insertItem(targetId, objectId);
  }
}
