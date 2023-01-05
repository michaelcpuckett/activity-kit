import { OutboxPostEndpoint } from '..';
import { AP } from 'activitypub-core-types';
export declare function handleLike(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
