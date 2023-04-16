import { LOCAL_DOMAIN } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '.';

export async function getActors(this: InboxPostEndpoint) {
  const url = `${LOCAL_DOMAIN}${this.req.url}`;
  const actor = await this.core.findOne('entity', {
    inbox: url,
  });

  if (!actor || !actor.id || !('inbox' in actor)) {
    throw new Error('No actor with this inbox.');
  }

  return [actor];
}
