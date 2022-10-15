import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function handleDelete(activity: AP.Delete | AP.Create, databaseService: Database): Promise<void>;
