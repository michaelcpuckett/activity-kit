import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function handleAnnounce(
  activity: AP.Announce,
  databaseService: Database,
): Promise<void>;
