import { InboxPostEndpoint } from '.';

// TODO: Check with Spec.

export async function shouldForwardActivity(this: InboxPostEndpoint) {
  return false;
}
