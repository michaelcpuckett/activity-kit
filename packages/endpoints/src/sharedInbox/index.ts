import { InboxPostEndpoint } from '../inbox';
import { getActors } from './getActors';
import { broadcastActivity } from './broadcastActivity';

export class SharedInboxPostEndpoint extends InboxPostEndpoint {
  protected override getActors = getActors;
  protected override broadcastActivity = broadcastActivity;
}
