import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { isLocal, getId } from '@activity-kit/utilities';

export async function handleAnnounce(
  this: OutboxPostEndpoint,
  activity: AP.Announce,
) {
  const actorId = getId(activity.actor);

  assert.exists(actorId);

  const actor = await this.core.queryById(actorId);

  assert.isApActor(actor);

  const shared = await this.core.getStreamByName(actor, 'Shared');

  assert.isApType<AP.OrderedCollection>(
    shared,
    AP.CollectionTypes.ORDERED_COLLECTION,
  );

  const sharedId = getId(shared);

  assert.exists(sharedId);

  const activityId = getId(activity);

  assert.exists(activityId);

  await this.core.insertOrderedItem(sharedId, activityId);

  const objectId = getId(activity.object);

  assert.exists(objectId);

  if (isLocal(objectId)) {
    const object = await this.core.queryById(objectId);

    assert.isApEntity(object);

    if (!('shares' in object)) {
      throw new Error('Object is local, but `shares` is not in this object.');
    }

    const sharesId = getId(object.shares);

    if (!sharesId) {
      throw new Error('Bad shares collection: no ID.');
    }

    await this.core.insertOrderedItem(sharesId, activityId);
  }
}
