import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { UploadMediaEndpoint } from '.';

export async function getActor(this: UploadMediaEndpoint) {
  const url = new URL(`${LOCAL_DOMAIN}${this.req.url}`);

  const actor = await this.databaseService.findOne('actor', {
    endpoints: {
      uploadMedia: url.toString(),
    }
  });

  if (!actor || !actor.id || !('outbox' in actor)) {
    throw new Error('No actor with this endpoint.');
  }

  this.actor = actor;
}
