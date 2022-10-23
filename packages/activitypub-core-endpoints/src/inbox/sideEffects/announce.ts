import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { InboxEndpoint } from '..';

export async function handleAnnounce(this: InboxEndpoint) {
  const activity = this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.databaseService.findEntityById(objectId);

  if (!object || !object.type || !object.id) {
    // Not applicable.
    return;
  }

  if (!('shares' in object) || !object.shares) {
    throw new Error('Bad object: No shares collection.');
  }

  const sharesId =
    object.shares instanceof URL ? object.shares : object.shares.id;

  if (!sharesId) {
    throw new Error('Bad shares collection: no ID.');
  }

  const shares = await this.databaseService.findEntityById(sharesId);

  if (!shares) {
    throw new Error('Bad shares collection: not found');
  }

  if (
    shares.type === AP.CollectionTypes.COLLECTION ||
    (Array.isArray(shares.type) &&
      shares.type.includes(AP.CollectionTypes.COLLECTION))
  ) {
    await this.databaseService.insertItem(sharesId, activity.id);
  } else if (
    shares.type === AP.CollectionTypes.ORDERED_COLLECTION ||
    (Array.isArray(shares.type) &&
      shares.type.includes(AP.CollectionTypes.ORDERED_COLLECTION))
  ) {
    await this.databaseService.insertOrderedItem(sharesId, activity.id);
  }
}
