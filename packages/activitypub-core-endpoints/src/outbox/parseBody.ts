import { assertIsApActivity } from 'activitypub-core-types';
import { parseStream } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '.';

export async function parseBody(this: OutboxPostEndpoint) {
  const result = await parseStream(this.req);

  assertIsApActivity(result);

  this.activity = result;
}
