import { Core } from '.';
import {
  AP,
  assertExists,
  assertIsApCollection,
  assertIsApTypeOf,
  assertIsArray,
} from '@activity-kit/types';
import { getId } from '@activity-kit/utilities';

export async function getPaginatedCollectionItems(
  this: Core,
  collection: AP.Collection | AP.OrderedCollection,
): Promise<AP.EntityReference[]> {
  const collectionItems: AP.EntityReference[][] = [];

  try {
    assertIsApCollection(collection);

    const firstCollectionPageId = getId(collection.first);

    if (firstCollectionPageId) {
      const firstCollectionPage = await this.queryById(firstCollectionPageId);

      try {
        assertIsApTypeOf<AP.EitherCollectionPage>(
          firstCollectionPage,
          Object.values(AP.CollectionPageTypes),
        );

        let nextCollectionPage: AP.EitherCollectionPage | null =
          firstCollectionPage;

        while (nextCollectionPage) {
          try {
            assertIsApTypeOf<AP.EitherCollectionPage>(
              nextCollectionPage,
              Object.values(AP.CollectionPageTypes),
            );

            const collectionPageItems =
              nextCollectionPage.orderedItems || nextCollectionPage.items;

            assertIsArray(collectionPageItems);

            collectionItems.push(collectionPageItems);

            const nextCollectionPageId = getId(nextCollectionPage.next);

            assertExists(nextCollectionPageId);

            const potentialNextCollectionPage = await this.queryById(
              nextCollectionPageId,
            );

            assertIsApTypeOf<AP.EitherCollectionPage>(
              potentialNextCollectionPage,
              Object.values(AP.CollectionPageTypes),
            );

            nextCollectionPage = potentialNextCollectionPage;
          } catch (error) {
            nextCollectionPage = null;
          }
        }
      } catch (error) {}
    } else {
      if (Array.isArray(collection.orderedItems)) {
        collectionItems.push(collection.orderedItems);
      } else if (Array.isArray(collection.items)) {
        collectionItems.push(collection.items);
      }
    }

    return collectionItems.flat();
  } catch (error) {
    // Not a Collection.

    return [];
  }
}