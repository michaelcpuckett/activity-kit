import { getId } from 'activitypub-core-utilities';
import { AP, assertIsApActor, assertIsApType } from 'activitypub-core-types';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoBlock(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Block>(activity, AP.ActivityTypes.BLOCK);

  const actorId = getId((activity as AP.Activity).actor);
  const actor = await this.layers.data.queryById(actorId);

  assertIsApActor(actor);

  const blocks = await this.layers.data.getStreamByName(actor, 'Blocks');

  assertIsApType<AP.Collection>(blocks, AP.CollectionTypes.COLLECTION);

  await this.layers.data.removeItem(blocks.id, activity.id);
}
