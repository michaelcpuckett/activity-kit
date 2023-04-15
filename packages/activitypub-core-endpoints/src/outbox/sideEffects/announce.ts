import { OutboxPostEndpoint } from '..';
import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApEntity,
  assertIsApType,
} from 'activitypub-core-types';
import { isLocal, getId } from 'activitypub-core-utilities';

export async function handleAnnounce(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Announce>(activity, AP.ActivityTypes.ANNOUNCE);

  const actorId = getId(activity.actor);
  const actor = await this.lib.queryById(actorId);

  assertIsApActor(actor);

  const shared = await this.lib.getStreamByName(actor, 'Shared');

  assertIsApType<AP.OrderedCollection>(
    shared,
    AP.CollectionTypes.ORDERED_COLLECTION,
  );

  await this.lib.insertOrderedItem(shared.id, activity.id);

  const objectId = getId(activity.object);

  assertExists(objectId);

  if (isLocal(objectId)) {
    const object = await this.lib.queryById(objectId);

    assertIsApEntity(object);

    if (!('shares' in object)) {
      throw new Error('Object is local, but `shares` is not in this object.');
    }

    const sharesId = getId(object.shares);

    if (!sharesId) {
      throw new Error('Bad shares collection: no ID.');
    }

    await this.lib.insertOrderedItem(sharesId, activity.id);
  }
}
