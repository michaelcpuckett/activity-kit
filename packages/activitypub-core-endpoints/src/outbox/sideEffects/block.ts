import { OutboxPostEndpoint } from '..';
import { assertExists, assertIsApActor, assertIsApEntity, assertIsApTransitiveActivity, assertIsArray } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';

export async function handleBlock(this: OutboxPostEndpoint) {
  assertIsApTransitiveActivity(this.activity);

  const actorId = getId(this.activity.actor);

  assertExists(actorId);

  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const objectId = getId(this.activity.object);

  assertExists(objectId);

  const object = await this.adapters.db.queryById(objectId);

  assertIsApActor(object);
  assertIsArray(actor.streams);

  const streams = await Promise.all(
    actor.streams
      .map(stream => getId(stream))
      .map(async id => id ? await this.adapters.db.findEntityById(id) : null)
  );

  const blocks = streams.find((stream) => {
    if (stream && 'name' in stream) {
      if (stream.name === 'Blocks') {
        return true;
      }
    }
  });

  assertIsApEntity(blocks);

  await this.adapters.db.insertItem(blocks.id, this.activity.id);
}
