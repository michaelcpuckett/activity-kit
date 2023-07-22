import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import {
  assertExists,
  assertIsApActor,
  assertIsApType,
} from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function handleBlock(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Block>(activity, AP.ActivityTypes.BLOCK);

  const actorId = getId(activity.actor);
  const actor = await this.core.queryById(actorId);

  assertIsApActor(actor);

  const blockedActorId = getId(activity.object);
  const blockedActor = await this.core.queryById(blockedActorId);

  assertIsApActor(blockedActor);

  const blocks = await this.core.getStreamByName(actor, 'Blocks');

  assertIsApType<AP.Collection>(blocks, AP.CollectionTypes.COLLECTION);

  const blocksId = getId(blocks);

  assertExists(blocksId);

  await this.core.insertItem(blocksId, activity.id);

  const followingId = getId(actor.following);

  assertExists(followingId);

  const followersId = getId(actor.followers);

  assertExists(followersId);

  await Promise.all([
    this.core.removeItem(followingId, blockedActorId),
    this.core.removeItem(followersId, blockedActorId),
  ]);
}
