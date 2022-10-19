import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
import { getId, getTypedEntity } from 'activitypub-core-utilities';

export async function expandCollection(
  this: MongoDatabase,
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
    foundThing.type !== AP.CollectionTypes.ORDERED_COLLECTION &&
    !(
      Array.isArray(foundThing.type) &&
      (foundThing.type.includes(AP.CollectionTypes.COLLECTION) ||
        foundThing.type.includes(AP.CollectionTypes.ORDERED_COLLECTION))
    )
  ) {
    return null;
  }

  const foundCollection = getTypedEntity(
    foundThing as { [key: string]: unknown },
  ) as AP.Collection | AP.OrderedCollection;

  const items = await this.getCollectionItems(foundCollection);

  if (!items) {
    return foundCollection;
  }

  if (
    foundCollection.type === AP.CollectionTypes.ORDERED_COLLECTION ||
    (Array.isArray(foundCollection.type) &&
      foundCollection.type.includes(AP.CollectionTypes.ORDERED_COLLECTION))
  ) {
    const orderedCollection = getTypedEntity(
      foundCollection as unknown as { [key: string]: unknown },
    ) as AP.OrderedCollection;

    return {
      ...orderedCollection,
      orderedItems: items,
    };
  }

  if (
    foundCollection.type === AP.CollectionTypes.COLLECTION ||
    (Array.isArray(foundCollection.type) &&
      foundCollection.type.includes(AP.CollectionTypes.ORDERED_COLLECTION))
  ) {
    const collection = getTypedEntity(
      foundCollection as unknown as { [key: string]: unknown },
    ) as AP.Collection;

    return {
      ...collection,
      items,
    };
  }

  return null;
}
