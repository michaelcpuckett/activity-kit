import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';

import { CoreLibrary } from './adapters';

/**
 * Given a Collection or OrderedCollection, convert its item/orderedItem
 * references to be full entities.
 *
 * @returns A Promise that resolves to the expanded Collection.
 */
export const expandCollection: CoreLibrary['expandCollection'] =
  async function expandCollection(
    this: CoreLibrary,
    collection: AP.EitherCollection,
  ): Promise<AP.EitherCollection> {
    const expandedCollection = {
      ...collection,
    };

    if (isArray(collection.orderedItems)) {
      const expandPromises = collection.orderedItems
        .filter(isEntityReference)
        .map(query.bind(this));

      const expanded = await Promise.all(expandPromises);

      expandedCollection.orderedItems = expanded;
    }

    if (isArray(collection.items)) {
      const expandPromises = collection.items
        .filter(isEntityReference)
        .map(query.bind(this));

      const expanded = await Promise.all(expandPromises);

      expandedCollection.items = expanded;
    }

    return expandedCollection;
  };

function isEntityReference(value: unknown): boolean {
  return guard.isApEntity(value) || guard.isUrl(value);
}

function isArray(
  items: AP.OrArray<AP.EntityReference> | undefined,
): items is Array<AP.Entity> {
  return guard.isArray(items) && items.length > 0;
}

async function query(
  this: CoreLibrary,
  item: AP.EntityReference,
): Promise<AP.EntityReference> {
  if (guard.isApEntity(item)) {
    return item;
  }

  const cachedItem = await this.queryById(item);

  return cachedItem ?? item;
}
