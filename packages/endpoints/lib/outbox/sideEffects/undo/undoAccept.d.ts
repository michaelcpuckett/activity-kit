import * as AP from '@activity-kit/types';
import { OutboxPostEndpoint } from '../..';
export declare function handleUndoAccept(this: OutboxPostEndpoint, activity: AP.Accept): Promise<void>;
