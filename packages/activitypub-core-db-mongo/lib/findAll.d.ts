import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function findAll(this: MongoDbAdapter, collection: string, matchingObject: {
    [key: string]: unknown;
}): Promise<AP.Entity[] | null>;
