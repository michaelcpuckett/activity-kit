import { AP } from '@activity-kit/types';
import { InboxPostEndpoint } from '..';
export declare function handleAccept(this: InboxPostEndpoint, activity: AP.Entity, recipient: AP.Actor): Promise<void>;
