import { OutboxPostEndpoint } from '.';
import { AP } from '@activity-kit/types';
export declare function wrapInActivity(this: OutboxPostEndpoint, body: AP.Entity): Promise<void>;
