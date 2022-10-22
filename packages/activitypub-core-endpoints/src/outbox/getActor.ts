import { LOCAL_DOMAIN } from "activitypub-core-utilities";
import { OutboxPostHandler } from ".";

export async function getActor(this: OutboxPostHandler) {
  const url = new URL(`${LOCAL_DOMAIN}${this.req.url}`);

  const actor = await this.databaseService.findOne('actor', {
    outbox: url.toString(),
  });

  if (!actor || !actor.id || !('outbox' in actor)) {
    throw new Error('No actor with this outbox.');
  }

  this.actor = actor;
}