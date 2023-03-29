import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function findAll(this: D1DbAdapter, collection: string, matchingObject: {
    [key: string]: unknown;
}): Promise<AP.Entity[] | null>;
