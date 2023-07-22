import { MongoDbAdapter } from '.';
import * as AP from '@activity-kit/types';
import { DbOptions } from '@activity-kit/core';
export declare function findOne(this: MongoDbAdapter, collection: string, matchingObject: Record<string, unknown>, options?: Array<keyof typeof DbOptions>): Promise<AP.Entity | null>;
