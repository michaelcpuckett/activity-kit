import { parseStream } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '.';

export async function parseBody(this: OutboxPostEndpoint) {
  const result = await parseStream(this.req);

  if (!result) {
    throw new Error('Bad request: Could not parse stream.');
  }

  this.activity = result;
}
