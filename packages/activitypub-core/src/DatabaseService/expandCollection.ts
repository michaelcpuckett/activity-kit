import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types/src';
import { getId } from '../utilities/getId';

export async function expandCollection(
  this: DatabaseService,
  collection: AP.EitherCollectionReference,
): Promise<null | AP.EitherCollection> {
  const id = getId(collection);

  if (!id) {
    return null;
  }

  const foundThing = await this.queryById(id);

  if (!foundThing) {
    return null;
  }

  if (
    foundThing.type !== AP.CollectionTypes.COLLECTION &&
    foundThing.type !== AP.CollectionTypes.ORDERED_COLLECTION
  ) {
    return null;
  }

  const items = await this.getCollectionItems(foundThing);

  if (!items) {
    return foundThing;
  }

  if (foundThing.type === AP.CollectionTypes.ORDERED_COLLECTION) {
    return {
      ...foundThing,
      orderedItems: items,
    };
  }

  if (foundThing.type === AP.CollectionTypes.COLLECTION) {
    return {
      ...foundThing,
      items,
    };
  }

  return null;
}
