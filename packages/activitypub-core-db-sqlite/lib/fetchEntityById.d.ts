import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function fetchEntityById(this: SqliteDbAdapter, id: URL): Promise<AP.Entity | null>;
