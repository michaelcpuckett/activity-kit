import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
export declare function handleAdd(this: OutboxPostEndpoint, activity: AP.Add | AP.Remove): Promise<void>;
