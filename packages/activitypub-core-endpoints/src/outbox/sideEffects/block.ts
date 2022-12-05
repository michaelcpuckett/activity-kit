import { OutboxPostEndpoint } from '..';
import { AP } from 'activitypub-core-types';
import { getCollectionNameByUrl, getId, isType, isTypeOf } from 'activitypub-core-utilities';

export async function handleBlock(this: OutboxPostEndpoint) {
  if (!this.activity) {
    return;
  }

  if (!('object' in this.activity)) {
    throw new Error('Bad activity: no object.');
  }

  if (!this.activity.id) {
    throw new Error('Bad activity: no ID.');
  }

  const actorId = getId((this.activity as AP.Activity).actor);

  if (!actorId) {
    throw new Error('Bad actor: no ID.');
  }

  const actor = await this.adapters.db.queryById(actorId);

  if (!actor || !('outbox' in actor)) {
    throw new Error('Bad actor: not found or no outbox.');
  }

  const objectId = getId(this.activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.db.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (!('id' in object) || !object.id) {
    throw new Error('Bad object: no ID.');
  }

  if (!isTypeOf(object, AP.ActorTypes)) {
    return;
  }

  if (
    !('streams' in actor) ||
    !actor.streams ||
    !Array.isArray(actor.streams)
  ) {
    throw new Error("Actor's streams not found.");
  }

  const streams = await Promise.all(
    actor.streams
      .map((stream: AP.Entity | URL) =>
        stream instanceof URL ? stream : stream.id,
      )
      .map(async (id: URL) =>
        id ? await this.adapters.db.findEntityById(id) : null,
      ),
  );

  const blocks = streams.find((stream) => {
    if (stream && 'name' in stream) {
      if (stream.name === 'Blocks') {
        return true;
      }
    }
  });

  if (!blocks || !blocks.id) {
    throw new Error('Bad blocks collection: not found.');
  }

  await Promise.all([
    this.adapters.db.insertItem(blocks.id, this.activity.id)
  ]);
}
