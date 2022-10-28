import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
export declare function saveActivity(this: InboxPostEndpoint & SharedInboxPostEndpoint): Promise<void>;
