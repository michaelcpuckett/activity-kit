import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';

import { CoreLibrary } from './adapters';

export async function expandCollection(
  this: CoreLibrary,
  collection: AP.EitherCollectionReference,
): Promise<AP.EitherCollection | null> {
  if (!guard.isApCollection(collection)) {
    return null;
  }

  const items = this.getCollectionItems(collection);

  const expandedItems = await Promise.all(
    items.map(async (item) => {
      if (guard.isApEntity(item)) {
        return item;
      }

      return (await this.queryById(item)) ?? item;
    }),
  );

  if (
    guard.isArray(collection.orderedItems) &&
    collection.orderedItems.length
  ) {
    return {
      ...collection,
      orderedItems: expandedItems,
    };
  } else if (guard.isArray(collection.items) && collection.items.length) {
    return {
      ...collection,
      items: expandedItems,
    };
  }

  return null;
}
