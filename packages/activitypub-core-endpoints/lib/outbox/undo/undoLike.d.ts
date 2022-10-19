import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function handleUndoLike(
  activity: AP.Like,
  databaseService: Database,
): Promise<void>;
