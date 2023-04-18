import { OutboxPostEndpoint } from '..';
import { AP } from '@activity-kit/types';
export declare function handleLike(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
