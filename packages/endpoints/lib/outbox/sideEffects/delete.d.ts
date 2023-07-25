import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
export declare function handleDelete(this: OutboxPostEndpoint, activity: AP.Delete | AP.Create): Promise<void>;
