import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
export declare function handleFollow(this: OutboxPostEndpoint, activity: AP.Follow): Promise<void>;
