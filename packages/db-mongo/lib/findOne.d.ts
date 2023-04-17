import { MongoDbAdapter } from '.';
import { AP, DbOptions } from '@activity-kit/types';
export declare function findOne(this: MongoDbAdapter, collection: string, matchingObject: Record<string, unknown>, options?: Array<keyof typeof DbOptions>): Promise<AP.Entity | null>;
