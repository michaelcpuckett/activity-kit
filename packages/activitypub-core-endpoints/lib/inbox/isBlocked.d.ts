import { AP } from 'activitypub-core-types';
import { InboxPostEndpoint } from '.';
export declare function isBlocked(this: InboxPostEndpoint, actor: AP.Actor): Promise<boolean>;
