import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import { getCollectionNameByUrl, getId } from 'activitypub-core-utilities';

export async function handleAnnounce(
  activity: AP.Announce,
  databaseService: Database,
) {
  if (!activity.id) {
    throw new Error('Bad request 6');
  }

  const activityActorId = getId(activity.actor);

  if (!activityActorId) {
    throw new Error('No actor ID.');
  }

  const actor = await databaseService.queryById(activityActorId);

  if (!actor || !('outbox' in actor)) {
    throw new Error('No actor.');
  }

  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('Bad request 1');
  }

  const object = await databaseService.queryById(activityObjectId);

  if (!object) {
    throw new Error('Bad request 2');
  }

  if (!('id' in object) || !object.id) {
    throw new Error('Bad request 3');
  }

  if (
    !('streams' in actor) ||
    !actor.streams ||
    !Array.isArray(actor.streams)
  ) {
    throw new Error('bad request 9');
  }

  const actorStreams = await Promise.all(
    actor.streams
      .map((stream) => (stream instanceof URL ? stream : stream.id))
      .map(async (id) => (id ? await databaseService.queryById(id) : null)),
  );

  const actorSharedCollection = actorStreams.find((stream) => {
    if (stream && 'name' in stream) {
      if (stream.name === 'Shared') {
        return true;
      }
    }
  });

  if (!actorSharedCollection || !actorSharedCollection.id) {
    throw new Error('bad request');
  }

  await Promise.all([
    databaseService.insertOrderedItem(actorSharedCollection.id, object.id),
  ]);

  const isLocal = getCollectionNameByUrl(object.id) !== 'remote-object';

  if (isLocal) {
    if (!('shares' in object) || !object.shares) {
      throw new Error('Bad request 4');
    }

    const objectSharesId = getId(object.shares);

    if (!objectSharesId) {
      throw new Error('Bad request 5');
    }

    await Promise.all([
      databaseService.insertOrderedItem(objectSharesId, activity.id),
    ]);
  }
}
