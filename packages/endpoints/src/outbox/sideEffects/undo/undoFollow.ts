import { getId } from '@activity-kit/utilities';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoFollow(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assert.isApType<AP.Follow>(activity, AP.ActivityTypes.FOLLOW);

  const actorId = getId(activity.actor);
  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const followingId = getId(actor.following);

  assert.exists(followingId);

  const objectId = getId(activity.object);
  const object = await this.core.queryById(objectId);

  assert.isApActor(object);

  await this.core.removeItem(followingId, objectId);
}
