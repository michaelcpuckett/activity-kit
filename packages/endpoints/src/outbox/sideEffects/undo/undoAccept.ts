import { getId } from '@activity-kit/utilities';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoAccept(
  this: OutboxPostEndpoint,
  activity: AP.Accept,
) {
  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.findEntityById(actorId);

  assert.isApActor(actor);

  const followersId = getId(actor.followers);

  assert.exists(followersId);

  const followId = getId(activity.object);

  assert.exists(followId);

  const follow = await this.core.queryById(followId);

  assert.isApType<AP.Follow>(follow, AP.ActivityTypes.FOLLOW);

  const followerId = getId(follow.actor);

  assert.exists(followerId);

  await this.core.removeItem(followersId, followerId);
}
