import { OutboxPostHandler } from '..';
import { AP } from 'activitypub-core-types';
export declare function handleRemove(this: OutboxPostHandler, activity?: AP.Entity): Promise<void>;
