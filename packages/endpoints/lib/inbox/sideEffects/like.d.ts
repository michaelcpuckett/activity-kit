import { AP } from '@activity-kit/types';
import { InboxPostEndpoint } from '..';
export declare function handleLike(this: InboxPostEndpoint, activity: AP.Entity, recipient: AP.Actor): Promise<void>;
