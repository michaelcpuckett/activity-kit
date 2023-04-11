import {
  AP,
  assertIsApCollection,
  assertIsApEntity,
  assertIsApTypeOf,
} from 'activitypub-core-types';
import {
  getId,
  isType,
  isTypeOf,
  PUBLIC_ACTOR,
} from 'activitypub-core-utilities';
import { DeliveryAdapter } from '.';

export async function getRecipientsList(
  this: DeliveryAdapter,
  to: AP.EntityReference | AP.EntityReference[],
): Promise<URL[]> {
  const toArray = Array.isArray(to) ? to : [to];
  const filteredToArray = toArray.filter(
    (recipient) => recipient.toString() !== PUBLIC_ACTOR,
  );

  /**
   * Get the IDs of all recipients.
   */
  const unfilteredRecipientsArray = (
    await Promise.all(
      filteredToArray.map(async (reference) => {
        if (reference instanceof URL) {
          const foundEntity = await this.adapters.db.queryById(reference);

          if (!foundEntity) {
            return null;
          }

          assertIsApEntity(foundEntity);

          if (isTypeOf(foundEntity, AP.ActorTypes)) {
            return foundEntity.id;
          }

          if (
            isType(foundEntity, AP.CollectionTypes.COLLECTION) ||
            isType(foundEntity, AP.CollectionTypes.ORDERED_COLLECTION)
          ) {
            assertIsApCollection(foundEntity);

            const collectionItems = [];

            if (!foundEntity.first) {
              if (foundEntity.orderedItems) {
                collectionItems.push(foundEntity.orderedItems);
              } else if (foundEntity.items) {
                collectionItems.push(foundEntity.items);
              }
            } else {
              const foundCollectionPage = await this.adapters.db.queryById(
                getId(foundEntity.first),
              );

              assertIsApTypeOf<AP.CollectionPage | AP.OrderedCollectionPage>(
                foundCollectionPage,
                Object.values(AP.CollectionPageTypes),
              );

              let nextCollectionPage = foundCollectionPage;

              while (nextCollectionPage) {
                assertIsApTypeOf<AP.CollectionPage | AP.OrderedCollectionPage>(
                  nextCollectionPage,
                  Object.values(AP.CollectionPageTypes),
                );

                const collectionPageItems =
                  foundCollectionPage.orderedItems || foundCollectionPage.items;

                collectionItems.push(collectionPageItems);

                const nextCollectionPageId = getId(nextCollectionPage.next);

                let foundNextCollectionPage = null;

                if (nextCollectionPageId) {
                  foundNextCollectionPage = await this.adapters.db.queryById(
                    nextCollectionPageId,
                  );
                }

                nextCollectionPage = foundNextCollectionPage;
              }
            }

            return collectionItems.flat();
          }

          return null;
        }

        if ('id' in reference) {
          return reference.id;
        }

        if ('href' in reference) {
          return reference.href;
        }
      }),
    )
  ).flat();

  const result: URL[] = [];

  for (const item of unfilteredRecipientsArray) {
    if (item instanceof URL) {
      result.push(item);
    }
  }

  return result;
}
