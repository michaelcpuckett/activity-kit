import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
export declare function broadcastActivity(this: InboxPostEndpoint & SharedInboxPostEndpoint): Promise<void>;
