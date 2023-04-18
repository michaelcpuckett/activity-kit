import { OutboxPostEndpoint } from '..';
import { AP } from '@activity-kit/types';
export declare function handleAnnounce(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
