import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleBlock(
  this: OutboxPostEndpoint,
  activity: AP.Block,
) {
  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const blockedActorId = getId(activity.object);

  assert.exists(blockedActorId);

  const blockedActor = await this.core.queryById(blockedActorId);

  assert.isApActor(blockedActor);

  const blocks = await this.core.getStreamByName(actor, 'Blocks');

  assert.isApType<AP.Collection>(blocks, AP.CollectionTypes.COLLECTION);

  const blocksId = getId(blocks);

  assert.exists(blocksId);

  const activityId = getId(activity);

  assert.exists(activityId);

  await this.core.insertItem(blocksId, activityId);

  const followingId = getId(actor.following);

  assert.exists(followingId);

  const followersId = getId(actor.followers);

  assert.exists(followersId);

  await Promise.all([
    this.core.removeItem(followingId, blockedActorId),
    this.core.removeItem(followersId, blockedActorId),
  ]);
}
