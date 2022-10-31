import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { UploadMediaPostEndpoint } from '.';

export async function getActor(this: UploadMediaPostEndpoint) {
  const url = new URL(`${LOCAL_DOMAIN}${this.req.url}`);

  const actor = await this.adapters.db.findOne('entity', {
    'endpoints.uploadMedia': url.toString(),
  });

  if (!actor || !actor.id || !('outbox' in actor)) {
    throw new Error('No actor with this endpoint.');
  }

  this.actor = actor;
}
