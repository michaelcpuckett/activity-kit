import * as AP from '@activity-kit/types';
import { OutboxPostEndpoint } from '../..';
export declare function handleUndoLike(this: OutboxPostEndpoint, activity: AP.Like): Promise<void>;
