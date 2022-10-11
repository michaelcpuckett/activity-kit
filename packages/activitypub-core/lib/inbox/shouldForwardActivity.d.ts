import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function shouldForwardActivity(activity: AP.Activity, recipient: AP.Actor, databaseService: Database): Promise<boolean>;
