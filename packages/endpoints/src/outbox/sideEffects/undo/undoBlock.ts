import { getId } from '@activity-kit/utilities';
import * as AP from '@activity-kit/types';
import { assertIsApActor, assertIsApType } from '@activity-kit/type-utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoBlock(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Block>(activity, AP.ActivityTypes.BLOCK);

  const actorId = getId((activity as AP.Activity).actor);
  const actor = await this.core.queryById(actorId);

  assertIsApActor(actor);

  const blocks = await this.core.getStreamByName(actor, 'Blocks');

  assertIsApType<AP.Collection>(blocks, AP.CollectionTypes.COLLECTION);

  await this.core.removeItem(blocks.id, activity.id);
}
