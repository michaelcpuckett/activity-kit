import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandEntity(this: SqliteDbAdapter, originalEntity: AP.Entity): Promise<AP.Entity>;
