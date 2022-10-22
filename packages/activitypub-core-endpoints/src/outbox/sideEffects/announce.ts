import { OutboxPostHandler } from '..';
import { AP } from 'activitypub-core-types';
import { getCollectionNameByUrl, getId } from 'activitypub-core-utilities';

export async function handleAnnounce(this: OutboxPostHandler) {
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
    throw new Error('Bad actor: not found or no outbox.');
  }

  const objectId = getId(this.activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.databaseService.queryById(objectId);

  if (!object) {
    throw new Error('Bad object: not found.');
  }

  if (!('id' in object) || !object.id) {
    throw new Error('Bad object: no ID.');
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
    throw new Error('Bad shared collection: not found.');
  }

  await Promise.all([
    this.databaseService.insertOrderedItem(shared.id, object.id),
  ]);

  const isLocal = getCollectionNameByUrl(object.id) !== 'foreign-object';

  if (isLocal) {
    if (!('shares' in object) || !object.shares) {
      throw new Error('Object is local, but `shares` is not in this object.');
    }

    const sharesId = getId(object.shares);

    if (!sharesId) {
      throw new Error('Bad shares collection: no ID.');
    }

    await Promise.all([
      this.databaseService.insertOrderedItem(sharesId, this.activity.id),
    ]);
  }
}
