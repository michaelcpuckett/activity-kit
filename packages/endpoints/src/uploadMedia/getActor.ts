import { LOCAL_DOMAIN } from '@activity-kit/utilities';
import { UploadMediaPostEndpoint } from '.';
import { assert } from '@activity-kit/type-utilities';

export async function getActor(this: UploadMediaPostEndpoint) {
  const url = new URL(this.req.url, LOCAL_DOMAIN);

  const actor = await this.core.findOne('entity', {
    'endpoints.uploadMedia': url.toString(),
  });

  assert.isApActor(actor);

  this.actor = actor;
}
