import { assert } from '@activity-kit/type-utilities';
import { parseStream } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '.';

export async function parseBody(this: InboxPostEndpoint) {
  const activity = await parseStream(this.req);

  assert.isApActivity(activity);

  this.activity = activity;
}
