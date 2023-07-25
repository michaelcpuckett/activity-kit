import * as AP from '@activity-kit/types';
import { InboxPostEndpoint } from '..';
export declare function handleAnnounce(this: InboxPostEndpoint, activity: AP.Announce, recipient: AP.Actor): Promise<void>;
