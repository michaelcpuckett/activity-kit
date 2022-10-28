import { AP } from 'activitypub-core-types';
import { OutboxPostEndpoint } from '../..';
export declare function handleUndoAnnounce(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
