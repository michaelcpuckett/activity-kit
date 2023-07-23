import { Core } from '.';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function getPaginatedCollectionItems(
  this: Core,
  collection: AP.Collection | AP.OrderedCollection,
): Promise<AP.EntityReference[]> {
  const collectionItems: AP.EntityReference[][] = [];

  try {
    assert.isApCollection(collection);

    const firstCollectionPageId = getId(collection.first);

    if (firstCollectionPageId) {
      const firstCollectionPage = await this.queryById(firstCollectionPageId);

      try {
        assert.isApTypeOf<AP.EitherCollectionPage>(
          firstCollectionPage,
          AP.CollectionPageTypes,
        );

        let nextCollectionPage: AP.EitherCollectionPage | null =
          firstCollectionPage;

        while (nextCollectionPage) {
          try {
            assert.isApTypeOf<AP.EitherCollectionPage>(
              nextCollectionPage,
              AP.CollectionPageTypes,
            );

            const collectionPageItems =
              nextCollectionPage.orderedItems || nextCollectionPage.items;

            assert.isArray(collectionPageItems);

            collectionItems.push(collectionPageItems);

            const nextCollectionPageId = getId(nextCollectionPage.next);

            assert.exists(nextCollectionPageId);

            const potentialNextCollectionPage = await this.queryById(
              nextCollectionPageId,
            );

            assert.isApTypeOf<AP.EitherCollectionPage>(
              potentialNextCollectionPage,
              AP.CollectionPageTypes,
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
