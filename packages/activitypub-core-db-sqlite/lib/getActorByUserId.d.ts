import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getActorByUserId(this: SqliteDbAdapter, userId: string): Promise<AP.Actor | null>;
