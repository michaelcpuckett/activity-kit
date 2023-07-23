import * as AP from '@activity-kit/types';
import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';
export declare function getActors(this: InboxPostEndpoint & SharedInboxPostEndpoint): Promise<AP.Actor[]>;
