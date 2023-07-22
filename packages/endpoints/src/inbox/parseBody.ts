import { assertIsApActivity } from '@activity-kit/type-utilities';
import { parseStream } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '.';

export async function parseBody(this: InboxPostEndpoint) {
  const activity = await parseStream(this.req);

  assertIsApActivity(activity);

  this.activity = activity;
}
