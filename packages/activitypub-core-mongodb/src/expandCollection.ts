import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
import { getId, getTypedEntity, isType } from 'activitypub-core-utilities';

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

  const foundCollection = getTypedEntity(foundThing) as
    | AP.Collection
    | AP.OrderedCollection;

  const items = await this.getCollectionItems(foundCollection);

  if (!items) {
    return foundCollection;
  }

  if (isType(foundCollection, AP.CollectionTypes.ORDERED_COLLECTION)) {
    const orderedCollection = getTypedEntity(
      foundCollection,
    ) as AP.OrderedCollection;

    return {
      ...orderedCollection,
      orderedItems: items,
    };
  }

  if (isType(foundCollection, AP.CollectionTypes.COLLECTION)) {
    const collection = getTypedEntity(foundCollection) as AP.Collection;

    return {
      ...collection,
      items,
    };
  }

  return null;
}
