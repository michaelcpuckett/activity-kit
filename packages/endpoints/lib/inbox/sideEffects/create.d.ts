import * as AP from '@activity-kit/types';
import { InboxPostEndpoint } from '..';
export declare function handleCreate(this: InboxPostEndpoint, activity: AP.Create, recipient: AP.Actor): Promise<void>;
