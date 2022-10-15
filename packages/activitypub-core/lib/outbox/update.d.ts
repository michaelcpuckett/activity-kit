import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function handleUpdate(
  activity: AP.Update,
  databaseService: Database,
): Promise<void>;
