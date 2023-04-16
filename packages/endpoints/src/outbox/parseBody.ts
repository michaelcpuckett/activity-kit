import { assertIsApActivity } from '@activity-kit/types';
import { parseStream } from '@activity-kit/utilities';
import { OutboxPostEndpoint } from '.';

export async function parseBody(this: OutboxPostEndpoint) {
  const result = await parseStream(this.req);

  assertIsApActivity(result);

  this.activity = result;
}
