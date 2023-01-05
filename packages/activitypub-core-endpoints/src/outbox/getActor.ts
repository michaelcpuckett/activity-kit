import { assertIsApActor } from 'activitypub-core-types';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '.';

export async function getActor(this: OutboxPostEndpoint) {
  const url = new URL(`${LOCAL_DOMAIN}${this.req.url}`);

  const actor = await this.adapters.db.findOne('entity', {
    outbox: url.toString(),
  });

  assertIsApActor(actor);

  this.actor = actor;
}
