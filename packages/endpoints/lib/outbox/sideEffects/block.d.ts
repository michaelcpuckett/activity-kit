import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
export declare function handleBlock(this: OutboxPostEndpoint, activity: AP.Entity): Promise<void>;
