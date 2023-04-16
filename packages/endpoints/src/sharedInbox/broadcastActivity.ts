import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';

export async function broadcastActivity(
  this: InboxPostEndpoint & SharedInboxPostEndpoint,
) {
  // TODO.
}
