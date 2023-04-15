import { assertIsApActor } from 'activitypub-core-types';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '.';

export async function getActor(this: OutboxPostEndpoint) {
  const url = new URL(this.req.url, LOCAL_DOMAIN);

  const actor = await this.layers.data.findOne('entity', {
    outbox: url.toString(),
  });

  assertIsApActor(actor);

  this.actor = actor;
}
