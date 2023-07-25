import * as AP from '@activity-kit/types';
import { InboxPostEndpoint } from '..';
export declare function handleAccept(this: InboxPostEndpoint, activity: AP.Accept, recipient: AP.Actor): Promise<void>;
