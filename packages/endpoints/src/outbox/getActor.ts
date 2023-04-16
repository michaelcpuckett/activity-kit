import { assertIsApActor } from '@activity-kit/types';
import { LOCAL_DOMAIN } from '@activity-kit/utilities';
import { OutboxPostEndpoint } from '.';

export async function getActor(this: OutboxPostEndpoint) {
  const url = new URL(this.req.url, LOCAL_DOMAIN);

  const actor = await this.core.findOne('entity', {
    outbox: url.toString(),
  });

  assertIsApActor(actor);

  this.actor = actor;
}
