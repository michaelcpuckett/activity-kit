import { AP } from 'activitypub-core-types';
import { isType, PUBLIC_ACTOR } from 'activitypub-core-utilities';
import { DeliveryAdapter } from '.';

export async function getRecipientsList(
  this: DeliveryAdapter,
  to: AP.EntityReference | AP.EntityReference[],
): Promise<URL[]> {
  const toArray = Array.isArray(to) ? to : [to];
  const filteredToArray = toArray.filter(
    (recipient) => recipient.toString() !== PUBLIC_ACTOR,
  );

  const unfilteredInboxArray = (
    await Promise.all(
      filteredToArray.map(async (reference) => {
        if (reference instanceof URL) {
          const foundThing = await this.adapters.db.queryById(reference);

          if (!foundThing) {
            return null;
          }

          if (
            typeof foundThing === 'object' &&
            'inbox' in foundThing &&
            foundThing.inbox
          ) {
            return foundThing.id;
          }

          if (
            typeof foundThing === 'object' &&
            isType(foundThing, AP.CollectionTypes.ORDERED_COLLECTION)
          ) {
            if ('orderedItems' in foundThing && foundThing.orderedItems) {
              return foundThing.orderedItems;
            }
          }

          if (
            typeof foundThing === 'object' &&
            isType(foundThing, AP.CollectionTypes.COLLECTION)
          ) {
            if ('items' in foundThing && foundThing.items) {
              return foundThing.items;
            }
          }

          if (
            typeof foundThing === 'object' &&
            (isType(foundThing, AP.CollectionTypes.COLLECTION) ||
              isType(foundThing, AP.CollectionTypes.ORDERED_COLLECTION))
          ) {
            if ('first' in foundThing && foundThing.first instanceof URL) {
              const foundCollectionPage = await this.adapters.db.queryById(
                foundThing.first,
              );

              if (
                typeof foundCollectionPage === 'object' &&
                isType(
                  foundCollectionPage,
                  AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
                ) &&
                'orderedItems' in foundCollectionPage &&
                foundCollectionPage.orderedItems
              ) {
                return foundCollectionPage.orderedItems;
              }

              if (
                typeof foundCollectionPage === 'object' &&
                isType(
                  foundCollectionPage,
                  AP.CollectionPageTypes.COLLECTION_PAGE,
                ) &&
                'items' in foundCollectionPage &&
                foundCollectionPage.items
              ) {
                return foundCollectionPage.items;
              }
            }
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

  for (const item of unfilteredInboxArray) {
    if (item instanceof URL) {
      result.push(item);
    }
  }

  return result;
}
