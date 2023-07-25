import { OutboxPostEndpoint } from '..';
import * as AP from '@activity-kit/types';
export declare function handleAnnounce(this: OutboxPostEndpoint, activity: AP.Announce): Promise<void>;
