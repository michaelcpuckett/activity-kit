import { SqliteDbAdapter } from '.';
import { AP, DbOptions } from '@activity-kit/types';
export declare function findOne(this: SqliteDbAdapter, collection: string, matchingObject: {
    [key: string]: unknown;
}, options?: Array<keyof typeof DbOptions>): Promise<AP.Entity | null>;
