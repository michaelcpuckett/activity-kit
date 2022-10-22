import { parseStream } from 'activitypub-core-utilities';
import { OutboxPostHandler } from '.';

export async function parseBody(this: OutboxPostHandler) {
  const result = await parseStream(this.req);

  if (!result) {
    throw new Error('Bad request: Could not parse stream.')
  }

  this.activity = result;
}