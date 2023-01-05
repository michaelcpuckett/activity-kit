import { OutboxPostEndpoint } from '..';
import { AP, assertExists, assertIsApActor, assertIsApEntity, assertIsApTransitiveActivity, assertIsApType, assertIsArray } from 'activitypub-core-types';
import { getCollectionNameByUrl, getId } from 'activitypub-core-utilities';

export async function handleAnnounce(this: OutboxPostEndpoint, activity: AP.Entity) {
  assertIsApType<AP.Announce>(activity, AP.ActivityTypes.ANNOUNCE);

  const actorId = getId(activity.actor);
  const actor = await this.adapters.db.queryById(actorId);

  assertIsApActor(actor);

  const shared = await this.adapters.db.getStreamByName(actor, 'Shared');
  
  assertIsApType<AP.OrderedCollection>(shared, AP.CollectionTypes.ORDERED_COLLECTION);

  await this.adapters.db.insertOrderedItem(shared.id, activity.id);

  const objectId = getId(activity.object);

  assertExists(objectId);

  const isLocal = getCollectionNameByUrl(objectId) !== 'foreign-entity';

  if (isLocal) {
    const object = await this.adapters.db.queryById(objectId);
  
    assertIsApEntity(object);

    if (!('shares' in object)) {
      throw new Error('Object is local, but `shares` is not in this object.');
    }

    const sharesId = getId(object.shares);

    if (!sharesId) {
      throw new Error('Bad shares collection: no ID.');
    }

    await this.adapters.db.insertOrderedItem(sharesId, activity.id);
  }
}
