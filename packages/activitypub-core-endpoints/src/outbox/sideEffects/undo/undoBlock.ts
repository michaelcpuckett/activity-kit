import { getId } from 'activitypub-core-utilities';
import { AP, assertIsApActor, assertIsApEntity, assertIsApType } from 'activitypub-core-types';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoBlock(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Block>(activity, AP.ActivityTypes.BLOCK);

  const actorId = getId((activity as AP.Activity).actor);
  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const blocks = await this.adapters.db.getStreamByName(actor, 'Blocks');

  assertIsApType<AP.Collection>(blocks, AP.CollectionTypes.COLLECTION);

  await this.adapters.db.removeItem(blocks.id, activity.id);
}
