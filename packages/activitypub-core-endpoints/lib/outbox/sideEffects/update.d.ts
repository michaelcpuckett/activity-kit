import { AP } from 'activitypub-core-types';
import { OutboxPostEndpoint } from '..';
export declare function handleUpdate(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
