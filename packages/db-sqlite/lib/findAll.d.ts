import { SqliteDbAdapter } from '.';
import { AP } from '@activity-kit/types';
export declare function findAll(this: SqliteDbAdapter, collection: string, matchingObject: {
    [key: string]: unknown;
}): Promise<AP.Entity[] | null>;
