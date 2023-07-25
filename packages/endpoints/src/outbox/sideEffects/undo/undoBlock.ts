import { getId } from '@activity-kit/utilities';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoBlock(
  this: OutboxPostEndpoint,
  activity: AP.Block,
) {
  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const blocks = await this.core.getStreamByName(actor, 'Blocks');

  assert.isApType<AP.Collection>(blocks, AP.CollectionTypes.COLLECTION);

  const blocksId = getId(blocks);

  assert.exists(blocksId);

  const activityId = getId(activity);

  assert.exists(activityId);

  await this.core.removeItem(blocksId, activityId);
}
