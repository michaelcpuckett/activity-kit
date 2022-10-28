import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
export declare function getActor(this: InboxPostEndpoint & SharedInboxPostEndpoint): Promise<void>;
