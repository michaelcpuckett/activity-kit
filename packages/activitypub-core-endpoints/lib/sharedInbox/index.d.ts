import { InboxPostEndpoint } from '../inbox';
import { getActor } from './getActor';
import { broadcastActivity } from './broadcastActivity';
import { saveActivity } from './saveActivity';
import { getRecipientInboxIds } from './getRecipientInboxIds';
export declare class SharedInboxPostEndpoint extends InboxPostEndpoint {
    getRecipientInboxIds: typeof getRecipientInboxIds;
    protected getActor: typeof getActor;
    protected broadcastActivity: typeof broadcastActivity;
    protected saveActivity: typeof saveActivity;
}
