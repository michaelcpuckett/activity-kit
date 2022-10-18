import { AP } from 'activitypub-core-types';
import { convertStringsToUrls, PUBLIC_ACTOR } from 'activitypub-core-utilities';
import { DeliveryService } from '.';

export async function getRecipientsList(
  this: DeliveryService,
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
          const foundThing = convertStringsToUrls(await this.databaseService.queryById(reference));

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
            foundThing.type === AP.CollectionTypes.ORDERED_COLLECTION
          ) {
            if (foundThing.orderedItems) {
              return foundThing.orderedItems;
            }
          }

          if (
            typeof foundThing === 'object' &&
            foundThing.type === AP.CollectionTypes.COLLECTION
          ) {
            if (foundThing.items) {
              return foundThing.items;
            }
          }

          if (
            typeof foundThing === 'object' &&
            (
              foundThing.type === AP.CollectionTypes.ORDERED_COLLECTION ||
              foundThing.type === AP.CollectionTypes.COLLECTION
            )
          ) {
            if (foundThing.first) {
              const foundCollectionPage = convertStringsToUrls(await this.databaseService.queryById(foundThing.first));

              if (
                typeof foundCollectionPage === 'object' &&
                foundCollectionPage.type === AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE &&
                foundCollectionPage.orderedItems
              ) {
                return foundCollectionPage.orderedItems;
              }


              if (
                typeof foundCollectionPage === 'object' &&
                foundCollectionPage.type === AP.CollectionPageTypes.COLLECTION_PAGE &&
                foundCollectionPage.items
              ) {
                console.log('has items')
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
