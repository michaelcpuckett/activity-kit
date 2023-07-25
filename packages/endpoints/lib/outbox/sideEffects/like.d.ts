import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
export declare function handleLike(this: OutboxPostEndpoint, activity: AP.Like): Promise<void>;
