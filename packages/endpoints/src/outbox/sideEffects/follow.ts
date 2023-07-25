import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleFollow(
  this: OutboxPostEndpoint,
  activity: AP.Follow,
) {
  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.findEntityById(actorId);

  assert.isApActor(actor);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  if (objectId.href === actorId.href) {
    throw new Error('Cannot follow self.');
  }
}
