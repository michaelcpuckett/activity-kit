import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandEntity(this: MongoDbAdapter, originalEntity: AP.Entity): Promise<AP.Entity>;
