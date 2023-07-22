import { isLocal } from '@activity-kit/utilities';
import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
import * as AP from '@activity-kit/types';
import {
  assertIsApActivity,
  assertIsApActor,
} from '@activity-kit/type-utilities';

export async function getActors(
  this: InboxPostEndpoint & SharedInboxPostEndpoint,
): Promise<AP.Actor[]> {
  assertIsApActivity(this.activity);

  const actorUrls = await this.core.getRecipientUrls(this.activity);

  console.log(actorUrls.map((url) => url.toString()));

  return (
    await Promise.all(
      actorUrls.map(async (actorUrl) => {
        if (!isLocal(actorUrl)) {
          return [];
        }

        try {
          const foundEntity = await this.core.findEntityById(actorUrl);

          assertIsApActor(foundEntity);

          return [foundEntity];
        } catch (error) {
          return [];
        }
      }),
    )
  ).flat();
}
