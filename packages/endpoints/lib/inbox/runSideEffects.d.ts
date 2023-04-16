import { InboxPostEndpoint } from '.';
import { AP } from '@activity-kit/types';
export declare function runSideEffects(this: InboxPostEndpoint, recipient: AP.Actor): Promise<void>;
