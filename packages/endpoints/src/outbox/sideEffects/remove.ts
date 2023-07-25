import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert, guard } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleRemove(
  this: OutboxPostEndpoint,
  activity: AP.Remove | AP.Add,
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
    await this.core.removeOrderedItem(targetId, objectId);
  } else {
    await this.core.removeItem(targetId, objectId);
  }
}
