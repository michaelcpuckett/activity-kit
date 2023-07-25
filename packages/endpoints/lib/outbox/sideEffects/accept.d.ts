import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
export declare function handleAccept(this: OutboxPostEndpoint, activity: AP.Accept): Promise<void>;
