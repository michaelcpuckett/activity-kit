import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleBlock(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assert.isApType<AP.Block>(activity, AP.ActivityTypes.BLOCK);

  const actorId = getId(activity.actor);
  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const blockedActorId = getId(activity.object);
  const blockedActor = await this.core.queryById(blockedActorId);

  assert.isApActor(blockedActor);

  const blocks = await this.core.getStreamByName(actor, 'Blocks');

  assert.isApType<AP.Collection>(blocks, AP.CollectionTypes.COLLECTION);

  const blocksId = getId(blocks);

  assert.exists(blocksId);

  await this.core.insertItem(blocksId, activity.id);

  const followingId = getId(actor.following);

  assert.exists(followingId);

  const followersId = getId(actor.followers);

  assert.exists(followersId);

  await Promise.all([
    this.core.removeItem(followingId, blockedActorId),
    this.core.removeItem(followersId, blockedActorId),
  ]);
}
