import { AP } from 'activitypub-core-types';
import { getId, isType } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from "..";

export async function handleAnnounce(this: InboxPostEndpoint) {
  const activity = this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.database.findEntityById(objectId);

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

  const shares = await this.adapters.database.findEntityById(sharesId);

  if (!shares) {
    throw new Error('Bad shares collection: not found');
  }

  if (
    isType(shares, AP.CollectionTypes.COLLECTION)
  ) {
    await this.adapters.database.insertItem(sharesId, activity.id);
  } else if (
    isType(shares.type, AP.CollectionTypes.ORDERED_COLLECTION)
  ) {
    await this.adapters.database.insertOrderedItem(sharesId, activity.id);
  }
}
