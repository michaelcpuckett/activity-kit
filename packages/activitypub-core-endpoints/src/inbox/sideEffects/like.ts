import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import type { Database } from 'activitypub-core-types';
import { InboxEndpoint } from '..';

export async function handleLike(this: InboxEndpoint) {
  const activity = this.activity;

  if (!('object' in activity)) {
    throw new Error('Bad activity: no object.');
  }

  const objectId = getId(activity.object);

  if (!objectId) {
    throw new Error('Bad object: no ID.');
  }

  const object = await this.databaseService.findEntityById(objectId);

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

  const likes = await this.databaseService.findEntityById(likesId);

  if (!likes) {
    throw new Error('Bad likes collection: not found.');
  }

  if (
    likes.type === AP.CollectionTypes.COLLECTION ||
    (Array.isArray(likes.type) &&
      likes.type.includes(AP.CollectionTypes.COLLECTION))
  ) {
    await this.databaseService.insertItem(likesId, activity.id);
  } else if (
    likes.type === AP.CollectionTypes.ORDERED_COLLECTION ||
    (Array.isArray(likes.type) &&
      likes.type.includes(AP.CollectionTypes.ORDERED_COLLECTION))
  ) {
    await this.databaseService.insertOrderedItem(likesId, activity.id);
  }
}
