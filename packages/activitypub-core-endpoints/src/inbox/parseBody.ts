import { AP } from 'activitypub-core-types';
import { parseStream } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '.';

export async function parseBody(this: InboxPostEndpoint) {
  const activity = (await parseStream(this.req)) as AP.Activity;

  if (!activity) {
    throw new Error('Bad activity: not found.');
  }

  this.activity = activity;
}
