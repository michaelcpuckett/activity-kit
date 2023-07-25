import { InboxPostEndpoint } from '.';

export async function getActors(this: InboxPostEndpoint) {
  const actor = await this.core.findOne('entity', {
    inbox: this.url.href,
  });

  if (!actor || !actor.id || !('inbox' in actor)) {
    throw new Error('No actor with this inbox.');
  }

  return [actor];
}
