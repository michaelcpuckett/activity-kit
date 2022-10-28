/// <reference types="node" />
import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
export declare function getRecipientInboxIds(this: InboxPostEndpoint & SharedInboxPostEndpoint): Promise<URL[]>;
