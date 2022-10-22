import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function handleUndo(
  activity: AP.Undo,
  databaseService: Database,
  initiator: AP.Actor,
): Promise<void>;
