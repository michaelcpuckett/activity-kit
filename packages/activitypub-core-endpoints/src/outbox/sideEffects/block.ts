import { OutboxPostEndpoint } from '..';
import { assertExists, assertIsApActor, assertIsApType } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

export async function handleBlock(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Block>(activity, AP.ActivityTypes.BLOCK);

  const actorId = getId(activity.actor);
  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const blockedActorId = getId(activity.object);
  const blockedActor = await this.adapters.db.queryById(blockedActorId);

  assertIsApActor(blockedActor);

  const blocks = await this.adapters.db.getStreamByName(actor, 'Blocks');

  assertIsApType<AP.Collection>(blocks, AP.CollectionTypes.COLLECTION);

  const blocksId = getId(blocks);

  assertExists(blocksId);

  await this.adapters.db.insertItem(blocksId, activity.id);

  const followingId = getId(actor.following);

  assertExists(followingId);

  const followersId = getId(actor.followers);

  assertExists(followersId);

  await Promise.all([
    this.adapters.db.removeItem(followingId, blockedActorId),
    this.adapters.db.removeItem(followersId, blockedActorId),
  ]);
}
