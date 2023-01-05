import { AP } from 'activitypub-core-types';
import { InboxPostEndpoint } from '..';
export declare function handleAccept(this: InboxPostEndpoint, activity: AP.Entity, recipient: AP.Actor): Promise<void>;
