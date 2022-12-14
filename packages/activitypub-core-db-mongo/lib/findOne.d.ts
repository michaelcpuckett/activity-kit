import { MongoDbAdapter } from '.';
import { AP, DbOptions } from 'activitypub-core-types';
export declare function findOne(this: MongoDbAdapter, collection: string, matchingObject: {
    [key: string]: unknown;
}, options?: typeof DbOptions[keyof typeof DbOptions]): Promise<AP.Entity | null>;
