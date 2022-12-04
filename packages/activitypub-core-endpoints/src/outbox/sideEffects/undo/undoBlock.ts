import { getId } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import { OutboxPostEndpoint } from '../..';

export async function handleUndoBlock(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  if (!activity.id) {
    throw new Error('Bad activity: no ID.');
  }

  const actorId = getId((activity as AP.Activity).actor);

  if (!actorId) {
    throw new Error('Bad actor: no ID.');
  }

  const actor = await this.adapters.db.queryById(actorId);

  if (!actor || !('outbox' in actor)) {
    throw new Error('Bad actor: not found.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.db.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (
    !('streams' in actor) ||
    !actor.streams ||
    !Array.isArray(actor.streams)
  ) {
    throw new Error('Bad actor: no streams.');
  }

  const streams = await Promise.all(
    actor.streams
      .map((stream: AP.Entity) => (stream instanceof URL ? stream : stream.id))
      .map(async (id: URL) =>
        id ? await this.adapters.db.queryById(id) : null,
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
    throw new Error('Bad actor: no blocks collection.');
  }

  const blocked = streams.find((stream) => {
    if (stream && 'name' in stream) {
      if (stream.name === 'Blocked') {
        return true;
      }
    }
  });

  if (!blocked || !blocked.id) {
    throw new Error('Bad actor: no blocked collection.');
  }

  await Promise.all([
    this.adapters.db.removeItem(blocks.id, activity.id),
    this.adapters.db.removeItem(blocked.id, object.id),
  ]);
}
