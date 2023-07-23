import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { isLocal } from '@activity-kit/utilities';
import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';

export async function getActors(
  this: InboxPostEndpoint & SharedInboxPostEndpoint,
): Promise<AP.Actor[]> {
  assert.isApActivity(this.activity);

  const actorUrls = await this.core.getRecipientUrls(this.activity);

  return (
    await Promise.all(
      actorUrls.map(async (actorUrl) => {
        if (!isLocal(actorUrl)) {
          return [];
        }

        try {
          const foundEntity = await this.core.findEntityById(actorUrl);

          assert.isApActor(foundEntity);

          return [foundEntity];
        } catch (error) {
          return [];
        }
      }),
    )
  ).flat();
}
