import { AP, assertIsApActivity } from 'activitypub-core-types';
import { parseStream } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '.';

export async function parseBody(this: InboxPostEndpoint) {
  const activity = await parseStream(this.req);

  assertIsApActivity(activity);

  this.activity = activity;
}
