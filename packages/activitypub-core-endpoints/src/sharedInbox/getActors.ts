import { getCollectionNameByUrl, isTypeOf } from 'activitypub-core-utilities';
import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
import { assertIsApActivity, assertIsApActor } from 'activitypub-core-types';
import { AP } from 'activitypub-core-types';

export async function getActors(
  this: InboxPostEndpoint & SharedInboxPostEndpoint,
): Promise<AP.Actor[]> {
  assertIsApActivity(this.activity);

  const actorUrls = await this.adapters.delivery.getRecipientUrls(
    this.activity,
  );

  console.log(`\\\\\\\\\\\\`);
  console.log(actorUrls.map((url) => url.toString()));
  console.log(`///////////`);

  const actors: AP.Actor[] = [];

  const foundEntities = await Promise.all(
    actorUrls.map(async (actorUrl) => {
      const isLocal = getCollectionNameByUrl(actorUrl) !== 'foreignEntity';

      if (isLocal) {
        return await this.adapters.db.findEntityById(actorUrl);
      }
    }),
  );

  for (const foundEntity of foundEntities) {
    try {
      assertIsApActor(foundEntity);
      actors.push(foundEntity);
    } catch (error) {}
  }

  return actors;
}
