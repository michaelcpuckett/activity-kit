import { OutboxPostHandler } from '..';
import { AP } from 'activitypub-core-types';
export declare function handleDelete(this: OutboxPostHandler, activity?: AP.Entity): Promise<void>;
