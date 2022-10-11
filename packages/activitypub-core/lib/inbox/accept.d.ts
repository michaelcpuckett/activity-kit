import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function handleAccept(activity: AP.Accept, databaseService: Database): Promise<void>;
