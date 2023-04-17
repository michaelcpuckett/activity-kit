import { SqliteDbAdapter } from '.';
import { AP } from '@activity-kit/types';
export declare function findAll(this: SqliteDbAdapter, collection: string, matchingObject: Record<string, unknown>): Promise<AP.Entity[] | null>;
