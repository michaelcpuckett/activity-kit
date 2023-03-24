import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function findEntityById(this: SqliteDbAdapter, id: URL): Promise<AP.Entity | null>;
