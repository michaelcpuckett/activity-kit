import { SqliteDbAdapter } from '.';
import { AP } from '@activity-kit/types';
export declare function saveEntity(this: SqliteDbAdapter, entity: AP.Entity): Promise<void>;
