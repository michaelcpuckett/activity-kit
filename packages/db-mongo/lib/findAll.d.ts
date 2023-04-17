import { MongoDbAdapter } from '.';
import { AP } from '@activity-kit/types';
export declare function findAll(this: MongoDbAdapter, collection: string, matchingObject: Record<string, unknown>): Promise<AP.Entity[] | null>;
