/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database } from 'activitypub-core-types';
import { DeliveryService } from 'activitypub-core-delivery';
import { InboxEndpoint } from '../inbox';
import { saveActivity } from './saveActivity';
import { getRecipientInboxIds } from './getRecipientInboxIds';
export declare function sharedInboxHandler(req: IncomingMessage, res: ServerResponse, databaseService: Database, deliveryService: DeliveryService): Promise<{
    props: {};
}>;
export declare class SharedInboxEndpoint extends InboxEndpoint {
    protected getRecipientInboxIds: typeof getRecipientInboxIds;
    protected saveActivity: typeof saveActivity;
}
