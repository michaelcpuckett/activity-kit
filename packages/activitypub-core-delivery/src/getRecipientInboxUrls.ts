import { DeliveryAdapter } from '.';
import { AP, assertIsApActor } from 'activitypub-core-types';
import { deduplicateUrls, getId } from 'activitypub-core-utilities';

export async function getRecipientInboxUrls(
  this: DeliveryAdapter,
  activity: AP.Activity,
  actor: AP.Actor,
  inboxesOnly?: boolean,
): Promise<URL[]> {
  const recipientUrls = await this.getRecipientUrls(activity);

  const unfilteredRecipientInboxUrls = await Promise.all(
    recipientUrls.map(async (recipient) => {
      try {
        if (recipient.toString() === getId(actor).toString()) {
          return null;
        }

        const foundEntity = await this.adapters.db.queryById(recipient);

        assertIsApActor(foundEntity);

        if (!inboxesOnly) {
          if (foundEntity.endpoints) {
            if (foundEntity.endpoints.sharedInbox instanceof URL) {
              return foundEntity.endpoints.sharedInbox;
            }
          }
        }

        return getId(foundEntity.inbox);
      } catch (error) {
        return null;
      }
    }),
  );

  const recipientInboxUrls: URL[] = [];

  for (const recipientInbox of unfilteredRecipientInboxUrls) {
    if (recipientInbox instanceof URL) {
      recipientInboxUrls.push(recipientInbox);
    }
  }

  return deduplicateUrls(recipientInboxUrls);
}
