import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';

export async function handleAnnounce(
  activity: AP.Announce,
  databaseService: Database,
): Promise<void> {
  if (!activity.id) {
    throw new Error('bad request; no id');
  }

  const activityObjectId = getId(activity.object);

  if (!activityObjectId) {
    throw new Error('Bad request wow');
  }

  const foundThing = await databaseService.findEntityById(activityObjectId);

  if (!foundThing || !foundThing.type || !foundThing.id) {
    // Not applicable.
    return;
  }

  if (!('shares' in foundThing && foundThing.shares)) {
    throw new Error('bad request - no shares collection.');
  }

  const sharesCollectionId =
    foundThing.shares instanceof URL ? foundThing.shares : foundThing.shares.id;

  if (!sharesCollectionId) {
    throw new Error('bad request ; no shares collection id');
  }

  const sharesCollection = await databaseService.findEntityById(
    sharesCollectionId,
  );

  if (!sharesCollection) {
    throw new Error('bad request; no shares collection');
  }

  if (sharesCollection.type === AP.CollectionTypes.COLLECTION || (
    Array.isArray(sharesCollection.type) &&
    sharesCollection.type.includes(AP.CollectionTypes.COLLECTION)
  )) {
    await databaseService.insertItem(sharesCollectionId, activity.id);
  } else if (sharesCollection.type === AP.CollectionTypes.ORDERED_COLLECTION || (
    Array.isArray(sharesCollection.type) &&
    sharesCollection.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
  )) {
    await databaseService.insertOrderedItem(sharesCollectionId, activity.id);
  }

  if (!foundThing.attributedTo) {
    return;
  }
}
