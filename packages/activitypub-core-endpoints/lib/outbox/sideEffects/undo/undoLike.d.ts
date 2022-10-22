import { AP } from 'activitypub-core-types';
import { OutboxPostHandler } from '../..';
export declare function handleUndoLike(this: OutboxPostHandler, activity: AP.Entity): Promise<void>;
