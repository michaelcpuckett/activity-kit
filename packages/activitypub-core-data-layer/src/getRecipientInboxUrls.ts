import { DataLayer } from '.';
import { AP, assertIsApActor } from 'activitypub-core-types';
import { deduplicateUrls, getId } from 'activitypub-core-utilities';

export async function getRecipientInboxUrls(
  this: DataLayer,
  activity: AP.Activity,
  actor: AP.Actor,
  inboxesOnly?: boolean,
): Promise<URL[]> {
  const recipientUrls = await this.getRecipientUrls(activity);

  const recipientInboxUrls = (
    await Promise.all(
      recipientUrls.map(async (recipientUrl) => {
        try {
          if (recipientUrl.toString() === getId(actor).toString()) {
            return [];
          }

          const foundEntity = await this.fetchEntityById(recipientUrl);

          assertIsApActor(foundEntity);

          if (!inboxesOnly) {
            if (foundEntity.endpoints) {
              if (foundEntity.endpoints.sharedInbox instanceof URL) {
                return [foundEntity.endpoints.sharedInbox];
              }
            }
          }

          const inboxId = getId(foundEntity.inbox);

          if (inboxId instanceof URL) {
            return [inboxId];
          }
        } catch (error) {
          return [];
        }
      }),
    )
  ).flat();

  return deduplicateUrls(recipientInboxUrls);
}
