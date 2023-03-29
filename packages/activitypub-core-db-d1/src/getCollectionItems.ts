import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import { getId, isType } from 'activitypub-core-utilities';

export async function getCollectionItems(
  this: D1DbAdapter,
  entity: URL | AP.Collection | AP.OrderedCollection,
): Promise<AP.EntityReference[]> {
  const id = getId(entity);

  if (!id) {
    return [];
  }

  const collection = await this.queryById(id);

  if (!collection) {
    return [];
  }

  if (
    collection.type !== AP.CollectionTypes.COLLECTION &&
    collection.type !== AP.CollectionTypes.ORDERED_COLLECTION
  ) {
    return [];
  }

  if (
    !(
      ('items' in collection && Array.isArray(collection.items)) ||
      ('orderedItems' in collection && Array.isArray(collection.orderedItems))
    )
  ) {
    return [];
  }

  const collectionItems = isType(
    collection,
    AP.CollectionTypes.ORDERED_COLLECTION,
  )
    ? (collection as AP.OrderedCollection).orderedItems
    : collection.items;

  if (!Array.isArray(collectionItems)) {
    return [];
  }

  const result: AP.EntityReference[] = [];

  for (const item of collectionItems) {
    if (item instanceof URL) {
      const foundEntity = await this.queryById(item);

      result.push(
        foundEntity
          ? await this.expandEntity(foundEntity)
          : {
              type: AP.CoreObjectTypes.TOMBSTONE,
              content: 'Not found',
            },
      );
    } else if (!Array.isArray(item) && item.id instanceof URL) {
      const foundEntity = await this.queryById(item.id);

      result.push(foundEntity ?? item);
    }
  }

  return result;
}
