import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
export declare function handleCreate(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
