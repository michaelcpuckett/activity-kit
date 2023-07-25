import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
export declare function handleRemove(this: OutboxPostEndpoint, activity: AP.Remove | AP.Add): Promise<void>;
