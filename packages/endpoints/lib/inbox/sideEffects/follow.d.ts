import * as AP from '@activity-kit/types';
import { InboxPostEndpoint } from '..';
export declare function handleFollow(this: InboxPostEndpoint, activity: AP.Entity, recipient: AP.Actor): Promise<void>;
