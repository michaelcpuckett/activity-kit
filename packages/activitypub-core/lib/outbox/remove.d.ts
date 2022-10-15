import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function handleRemove(
  activity: AP.Remove | AP.Add,
  databaseService: Database,
): Promise<void>;
