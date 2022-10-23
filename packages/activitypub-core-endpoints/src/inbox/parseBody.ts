import { AP } from "activitypub-core-types";
import { parseStream } from "activitypub-core-utilities";
import { InboxEndpoint } from ".";

export async function parseBody(this: InboxEndpoint) {
  const activity = await parseStream(this.req) as AP.Activity;

  if (!activity) {
    throw new Error('Bad activity: not found.');
  }

  this.activity = activity;
}