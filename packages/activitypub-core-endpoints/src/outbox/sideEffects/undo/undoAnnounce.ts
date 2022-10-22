import { getId } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import { OutboxPostHandler } from '../..';

export async function handleUndoAnnounce(this: OutboxPostHandler) {
  if (!('object' in this.activity)) {
    return;
  }

  if (!this.activity.id) {
    throw new Error('Bad activity: no ID.');
  }

  const actorId = getId((this.activity as AP.Activity).actor);

  if (!actorId) {
    throw new Error('Bad actor: no ID.');
  }

  const actor = await this.databaseService.queryById(actorId);

  if (!actor || !('outbox' in actor)) {
    throw new Error('Bad actor: not found.');
  }

  const objectId = getId(this.activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.databaseService.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (!('shares' in object) || !object.shares) {
    throw new Error('Bad object: no shares collection.');
  }

  const sharesId = getId(object.shares);

  if (!sharesId) {
    throw new Error('Bad shares collection: no ID.');
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
        id ? await this.databaseService.queryById(id) : null,
      ),
  );

  const shared = streams.find((stream) => {
    if (stream && 'name' in stream) {
      if (stream.name === 'Shared') {
        return true;
      }
    }
  });

  if (!shared || !shared.id) {
    throw new Error('Bad actor: no shared collection.');
  }

  await Promise.all([
    this.databaseService.removeOrderedItem(sharesId, this.activity.id),
    this.databaseService.removeOrderedItem(shared.id, object.id),
  ]);
}
