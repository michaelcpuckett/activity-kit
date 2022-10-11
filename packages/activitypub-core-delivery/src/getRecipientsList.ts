import { AP } from 'activitypub-core-types';
import { PUBLIC_ACTOR } from 'activitypub-core-utilities';
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
          const foundThing = await this.databaseService.queryById(reference);

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
            foundThing.type === AP.CollectionTypes.ORDERED_COLLECTION &&
            foundThing.orderedItems
          ) {
            return foundThing.orderedItems;
          }

          if (
            typeof foundThing === 'object' &&
            'items' in foundThing &&
            foundThing.items
          ) {
            return foundThing.items;
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
