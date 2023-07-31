import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

import { CoreLibrary } from '.';

/**
 * Given a Collection or OrderedCollection, traverse its pages and return all
 * items.
 *
 * This is useful for getting all items in a foreign Collection, which may be
 * paginated.
 *
 * @returns A Promise that resolves to an array of all items in the Collection.
 */
export async function getPaginatedCollectionItems(
  this: CoreLibrary,
  collection: AP.EitherCollection,
): Promise<AP.EntityReference[]> {
  const firstCollectionPageId = getId(collection.first);

  if (!firstCollectionPageId) {
    // TODO .getArray()

    if (guard.isArray(collection.orderedItems)) {
      return collection.orderedItems;
    }

    if (guard.isArray(collection.items)) {
      return collection.items;
    }

    return [];
  }

  const firstCollectionPage = await this.queryById(firstCollectionPageId);

  if (
    !guard.isApTypeOf<AP.CollectionPage>(
      firstCollectionPage,
      AP.CollectionPageTypes,
    )
  ) {
    return [];
  }

  const collectionItems: AP.EntityReference[][] = [];

  let nextCollectionPage = firstCollectionPage;

  while (nextCollectionPage) {
    if (guard.isArray(nextCollectionPage.orderedItems)) {
      collectionItems.push(nextCollectionPage.orderedItems);
    }

    if (guard.isArray(nextCollectionPage.items)) {
      collectionItems.push(nextCollectionPage.items);
    }

    const nextPageId = getId(nextCollectionPage.next);

    if (!guard.exists(nextPageId)) {
      break;
    }

    const nextPage = await this.queryById(nextPageId);

    if (
      !guard.isApTypeOf<AP.CollectionPage>(nextPage, AP.CollectionPageTypes)
    ) {
      break;
    }

    nextCollectionPage = nextPage;
  }

  return collectionItems.flat();
}
