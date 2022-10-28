import { AP } from 'activitypub-core-types';
import { getId, isType } from 'activitypub-core-utilities';
import type { Database } from 'activitypub-core-types';
import { InboxPostEndpoint } from '..';

export async function handleLike(this: InboxPostEndpoint) {
  const activity = this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.adapters.database.findEntityById(objectId);

  if (!object) {
    // Not applicable.
    return;
  }

  if (!('likes' in object) || !object.likes) {
    throw new Error('Bad object: no likes collection.');
  }

  const likesId = getId(object.likes);

  if (!likesId) {
    throw new Error('Bad likes collection: no ID.');
  }

  const likes = await this.adapters.database.findEntityById(likesId);

  if (!likes) {
    throw new Error('Bad likes collection: not found.');
  }

  if (isType(likes, AP.CollectionTypes.COLLECTION)) {
    await this.adapters.database.insertItem(likesId, activity.id);
  } else if (isType(likes, AP.CollectionTypes.ORDERED_COLLECTION)) {
    await this.adapters.database.insertOrderedItem(likesId, activity.id);
  }
}
