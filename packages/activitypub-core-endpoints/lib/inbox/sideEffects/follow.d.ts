import { AP } from 'activitypub-core-types';
import { InboxPostEndpoint } from '..';
export declare function handleFollow(this: InboxPostEndpoint, activity: AP.Entity): Promise<void>;
