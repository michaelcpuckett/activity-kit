import { LOCAL_DOMAIN } from "activitypub-core-utilities";
import { InboxEndpoint } from ".";

export async function getActor(this: InboxEndpoint) {
  const url = `${LOCAL_DOMAIN}${this.req.url}`;
  const actor = await this.databaseService.findOne('actor', {
    inbox: url,
  });

  if (!actor || !actor.id || !('inbox' in actor)) {
    throw new Error('No actor with this inbox.');
  }

  this.actor = actor;
}