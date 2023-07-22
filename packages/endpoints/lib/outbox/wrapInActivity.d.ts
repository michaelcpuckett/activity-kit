import { OutboxPostEndpoint } from '.';
import * as AP from '@activity-kit/types';
export declare function wrapInActivity(this: OutboxPostEndpoint, body: AP.Entity): Promise<AP.Activity>;
