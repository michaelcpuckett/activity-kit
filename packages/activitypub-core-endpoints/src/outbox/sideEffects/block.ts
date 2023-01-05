import { OutboxPostEndpoint } from '..';
import { assertIsApActor, assertIsApType } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

export async function handleBlock(this: OutboxPostEndpoint, activity: AP.Entity) {
  assertIsApType<AP.Block>(activity, AP.ActivityTypes.BLOCK);

  const actorId = getId(activity.actor);
  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const blocks = await this.adapters.db.getStreamByName(actor, 'Blocks');

  assertIsApType<AP.Collection>(blocks, AP.CollectionTypes.COLLECTION);

  await this.adapters.db.insertItem(blocks.id, activity.id);
}
