import { assertIsApActor } from '@activity-kit/type-utilities';
import { OutboxPostEndpoint } from '.';

export async function getActor(this: OutboxPostEndpoint) {
  const actor = await this.core.findOne('entity', {
    outbox: this.url.toString(),
  });

  assertIsApActor(actor);

  this.actor = actor;
}
