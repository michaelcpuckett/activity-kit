import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
import { AP } from 'activitypub-core-types';
export declare function getActors(this: InboxPostEndpoint & SharedInboxPostEndpoint): Promise<AP.Actor[]>;
