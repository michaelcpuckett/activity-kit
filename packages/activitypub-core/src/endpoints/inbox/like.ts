import { AP } from 'activitypub-core-types';
import { DatabaseService } from '../../DatabaseService';
import { getId } from '../../utilities/getId';

export async function handleLike(
  activity: AP.Like,
  databaseService: DatabaseService,
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

  if (likesCollection.type === AP.CollectionTypes.COLLECTION) {
    await databaseService.insertItem(likesCollectionId, activity.id);
  } else if (likesCollection.type === AP.CollectionTypes.ORDERED_COLLECTION) {
    await databaseService.insertOrderedItem(likesCollectionId, activity.id);
  }
}
