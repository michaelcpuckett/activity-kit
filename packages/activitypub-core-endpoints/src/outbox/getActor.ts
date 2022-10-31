import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '.';

export async function getActor(this: OutboxPostEndpoint) {
  const url = new URL(`${LOCAL_DOMAIN}${this.req.url}`);

  const actor = await this.adapters.db.findOne('entity', {
    outbox: url.toString(),
  });

  if (!actor || !actor.id || !('outbox' in actor)) {
    throw new Error('No actor with this outbox.');
  }

  this.actor = actor;
}
