import { OutboxPostEndpoint } from '..';
import { AP } from 'activitypub-core-types';
export declare function handleAdd(this: OutboxPostEndpoint, activity?: AP.Entity): Promise<void>;
