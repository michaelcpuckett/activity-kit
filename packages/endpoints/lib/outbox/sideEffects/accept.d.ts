import { OutboxPostEndpoint } from '..';
import { AP } from '@activity-kit/types';
export declare function handleAccept(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;