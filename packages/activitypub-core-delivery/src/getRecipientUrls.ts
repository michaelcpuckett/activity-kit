import { DeliveryAdapter } from '.';
import {
  AP,
  assertIsApCollection,
  assertIsApActor,
  assertExists,
} from 'activitypub-core-types';
import {
  getId,
  PUBLIC_ACTOR,
  deduplicateUrls,
} from 'activitypub-core-utilities';

const getRecipientsInArrayFormat = (
  recipientList: AP.EntityReference | AP.EntityReference[],
): AP.EntityReference[] =>
  recipientList
    ? Array.isArray(recipientList)
      ? recipientList
      : [recipientList]
    : [];

export async function getRecipientUrls(
  this: DeliveryAdapter,
  activity: AP.Activity,
): Promise<URL[]> {
  const recipients: AP.EntityReference[] = [
    ...getRecipientsInArrayFormat(activity.to),
    ...getRecipientsInArrayFormat(activity.cc),
    ...getRecipientsInArrayFormat(activity.bto),
    ...getRecipientsInArrayFormat(activity.bcc),
    ...getRecipientsInArrayFormat(activity.audience),
  ].flat();

  const recipientIds = recipients
    .map((recipient) => getId(recipient))
    .filter((recipientUrl) => `${recipientUrl}` !== PUBLIC_ACTOR);

  const actorUrls = (
    await Promise.all(
      recipientIds.map(async (recipientId) => {
        const foundRecipient = await this.adapters.db.queryById(recipientId);

        if (!foundRecipient) {
          return [];
        }

        try {
          assertIsApActor(foundRecipient);

          const actorUrl = foundRecipient.url || foundRecipient.id;

          if (actorUrl instanceof URL) {
            return [actorUrl];
          }
        } catch (error) {
          // Not an Actor.
        }

        try {
          assertIsApCollection(foundRecipient);

          const collectionItems =
            await this.adapters.db.getCollectionItemsByPagination(
              foundRecipient,
            );

          const actorsInCollection = [];

          for (const collectionItem of collectionItems) {
            try {
              const collectionItemId = getId(collectionItem);

              assertExists(collectionItemId);

              const expandedCollectionItem = await this.adapters.db.queryById(
                collectionItemId,
              );

              assertIsApActor(expandedCollectionItem);

              const actorUrl =
                expandedCollectionItem.url || expandedCollectionItem.id;

              if (actorUrl instanceof URL) {
                actorsInCollection.push(actorUrl);
              }
            } catch (error) {
              // Not an Actor.
            }
          }

          return actorsInCollection;
        } catch (error) {
          // Not a Collection.
        }

        return [];
      }),
    )
  ).flat();

  return deduplicateUrls(actorUrls);
}
