import { OutboxPostEndpoint } from '..';
import { AP } from 'activitypub-core-types';
export declare function handleRemove(this: OutboxPostEndpoint, activity?: AP.Entity): Promise<void>;
