import { InboxPostEndpoint } from '../inbox';
import { getActors } from './getActors';
import { broadcastActivity } from './broadcastActivity';
export declare class SharedInboxPostEndpoint extends InboxPostEndpoint {
    protected getActors: typeof getActors;
    protected broadcastActivity: typeof broadcastActivity;
}
