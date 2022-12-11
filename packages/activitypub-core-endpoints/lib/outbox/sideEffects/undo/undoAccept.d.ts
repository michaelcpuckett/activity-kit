import { AP } from 'activitypub-core-types';
import { OutboxPostEndpoint } from '../..';
export declare function handleUndoAccept(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
