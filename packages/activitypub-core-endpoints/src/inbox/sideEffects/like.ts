import { AP } from 'activitypub-core-types';
import { getId, isType } from 'activitypub-core-utilities';
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

  const object = await this.adapters.db.findEntityById(objectId);

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

  const likes = await this.adapters.db.findEntityById(likesId);

  if (!likes) {
    throw new Error('Bad likes collection: not found.');
  }

  if (isType(likes, AP.CollectionTypes.COLLECTION)) {
    await this.adapters.db.insertItem(likesId, activity.id);
  } else if (isType(likes, AP.CollectionTypes.ORDERED_COLLECTION)) {
    await this.adapters.db.insertOrderedItem(likesId, activity.id);
  }
}
