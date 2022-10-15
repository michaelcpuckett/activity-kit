import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function handleAdd(
  activity: AP.Add | AP.Remove,
  databaseService: Database,
): Promise<void>;
