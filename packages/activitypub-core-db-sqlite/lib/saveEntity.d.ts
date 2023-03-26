import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function saveEntity(this: SqliteDbAdapter, entity: AP.Entity): Promise<void>;
