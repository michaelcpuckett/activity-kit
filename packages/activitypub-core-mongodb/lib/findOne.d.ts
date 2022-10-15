import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
export declare function findOne(
  this: MongoDatabase,
  collection: string,
  matchingObject: {
    [key: string]: unknown;
  },
): Promise<AP.Entity | null>;
