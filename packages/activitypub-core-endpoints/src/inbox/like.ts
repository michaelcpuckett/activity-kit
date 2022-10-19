import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import type { Database } from 'activitypub-core-types';

export async function handleLike(
  activity: AP.Like,
  databaseService: Database,
): Promise<void> {
  if (!activity.id) {
    throw new Error('bad request; no id');
  }

  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('Bad request; no activity');
  }

  const foundThing = await databaseService.findEntityById(activityObjectId);

  if (!foundThing || !foundThing.type) {
    // Not applicable.
    return;
  }

  if (!('likes' in foundThing && foundThing.likes)) {
    throw new Error('bad request - no likes collection.');
  }

  const likesCollectionId =
    foundThing.likes instanceof URL ? foundThing.likes : foundThing.likes.id;

  if (!likesCollectionId) {
    throw new Error('bad request ; no likes collection');
  }

  const likesCollection = await databaseService.findEntityById(
    likesCollectionId,
  );

  if (!likesCollection) {
    throw new Error('bad request ;; no likes collection');
  }

  if (likesCollection.type === AP.CollectionTypes.COLLECTION || (
    Array.isArray(likesCollection.type) &&
    likesCollection.type.includes(AP.CollectionTypes.COLLECTION)
  )) {
    await databaseService.insertItem(likesCollectionId, activity.id);
  } else if (likesCollection.type === AP.CollectionTypes.ORDERED_COLLECTION || (
    Array.isArray(likesCollection.type) &&
    likesCollection.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
  )) {
    await databaseService.insertOrderedItem(likesCollectionId, activity.id);
  }
}
