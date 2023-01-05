import { InboxPostEndpoint } from '.';
import { AP } from 'activitypub-core-types';
export declare function runSideEffects(this: InboxPostEndpoint, recipient: AP.Actor): Promise<void>;
