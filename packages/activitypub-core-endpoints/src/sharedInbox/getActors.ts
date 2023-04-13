import { isTypeOf } from 'activitypub-core-utilities';
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
  const actors: AP.Actor[] = [];

  const foundEntities = await Promise.all(
    actorUrls.map((actorUrl) => this.adapters.db.queryById(actorUrl)),
  );

  for (const foundEntity of foundEntities) {
    try {
      assertIsApActor(foundEntity);
      actors.push(foundEntity);
    } catch (error) {}
  }

  return actors;
}
