import { DeliveryAdapter } from '.';
import {
  AP,
  assertIsApCollection,
  assertIsApEntity,
  assertIsApActor,
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
  const unfilteredRecipients: AP.EntityReference[] = [
    ...getRecipientsInArrayFormat(activity.to),
    ...getRecipientsInArrayFormat(activity.cc),
    ...getRecipientsInArrayFormat(activity.bto),
    ...getRecipientsInArrayFormat(activity.bcc),
    ...getRecipientsInArrayFormat(activity.audience),
  ];

  const filteredRecipients = unfilteredRecipients.filter(
    (recipient) => getId(recipient)?.toString() !== PUBLIC_ACTOR,
  );

  /**
   * Get the Urls of all recipients. Traverse Collections.
   */
  const unfilteredRecipientUrls = (
    await Promise.all(
      filteredRecipients.map(async (recipient) => {
        if (recipient instanceof URL) {
          const foundRecipient = await this.adapters.db.queryById(recipient);

          if (!foundRecipient) {
            return null;
          }

          try {
            assertIsApEntity(foundRecipient);
          } catch (error) {
            // Not an AP Entity.
            return null;
          }

          try {
            assertIsApActor(foundRecipient);
            return getId(foundRecipient);
          } catch (error) {
            // Not an Actor.
          }

          try {
            assertIsApCollection(foundRecipient);

            return await this.adapters.db.getCollectionItemsByPagination(
              foundRecipient,
            );
          } catch (error) {
            // Not a Collection.
          }
        }

        try {
          assertIsApActor(recipient);
          return getId(recipient);
        } catch (error) {
          return null;
        }
      }),
    )
  ).flat();

  const filteredRecipientUrls: URL[] = [];

  for (const item of unfilteredRecipientUrls) {
    if (item instanceof URL) {
      filteredRecipientUrls.push(item);
    }
  }

  return deduplicateUrls(filteredRecipientUrls);
}
