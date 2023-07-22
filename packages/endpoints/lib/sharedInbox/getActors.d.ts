import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
import * as AP from '@activity-kit/types';
export declare function getActors(this: InboxPostEndpoint & SharedInboxPostEndpoint): Promise<AP.Actor[]>;
