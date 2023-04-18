import { AP } from '@activity-kit/types';
import { OutboxPostEndpoint } from '../..';
export declare function handleUndo(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
