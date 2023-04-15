import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { UploadMediaPostEndpoint } from '.';
import { assertIsApActor } from 'activitypub-core-types';

export async function getActor(this: UploadMediaPostEndpoint) {
  const url = new URL(this.req.url, LOCAL_DOMAIN);

  const actor = await this.lib.findOne('entity', {
    'endpoints.uploadMedia': url.toString(),
  });

  assertIsApActor(actor);

  this.actor = actor;
}
