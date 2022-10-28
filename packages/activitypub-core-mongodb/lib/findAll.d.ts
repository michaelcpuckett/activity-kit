import { MongoDatabaseAdapterDb } from '.';
import { AP } from 'activitypub-core-types';
export declare function findAll(this: MongoDatabaseAdapterDb, collection: string, matchingObject: {
    [key: string]: unknown;
}): Promise<AP.Entity[] | null>;
