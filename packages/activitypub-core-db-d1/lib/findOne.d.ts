import { D1DbAdapter } from '.';
import { AP, DbOptions } from 'activitypub-core-types';
export declare function findOne(this: D1DbAdapter, collection: string, matchingObject: {
    [key: string]: unknown;
}, options?: Array<keyof typeof DbOptions>): Promise<AP.Entity | null>;
