import { AP } from 'activitypub-core-types';
import { InboxPostEndpoint } from '..';
export declare function handleLike(this: InboxPostEndpoint, activity: AP.Entity, recipient: AP.Actor): Promise<void>;
