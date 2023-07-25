import * as AP from '@activity-kit/types';
import { InboxPostEndpoint } from '..';
export declare function handleLike(this: InboxPostEndpoint, activity: AP.Like, recipient: AP.Actor): Promise<void>;
