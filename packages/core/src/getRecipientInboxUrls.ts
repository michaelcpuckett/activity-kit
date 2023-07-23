import { Core } from '.';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { deduplicateUrls, getId } from '@activity-kit/utilities';

export async function getRecipientInboxUrls(
  this: Core,
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

          assert.isApActor(foundEntity);

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
