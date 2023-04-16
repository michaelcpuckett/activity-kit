import { OutboxPostEndpoint } from '..';
import { AP } from '@activity-kit/types';
export declare function handleCreate(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
