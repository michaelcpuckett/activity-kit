import { isLocal } from 'activitypub-core-utilities';
import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
import { assertIsApActivity, assertIsApActor } from 'activitypub-core-types';
import { AP } from 'activitypub-core-types';

export async function getActors(
  this: InboxPostEndpoint & SharedInboxPostEndpoint,
): Promise<AP.Actor[]> {
  assertIsApActivity(this.activity);

  const actorUrls = await this.lib.getRecipientUrls(this.activity);

  console.log(actorUrls.map((url) => url.toString()));

  return (
    await Promise.all(
      actorUrls.map(async (actorUrl) => {
        if (!isLocal(actorUrl)) {
          return [];
        }

        try {
          const foundEntity = await this.lib.findEntityById(actorUrl);

          assertIsApActor(foundEntity);

          return [foundEntity];
        } catch (error) {
          return [];
        }
      }),
    )
  ).flat();
}
