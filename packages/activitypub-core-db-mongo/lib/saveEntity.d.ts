import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function saveEntity(this: MongoDbAdapter, entity: AP.Entity): Promise<import("bson").Document | import("mongodb").UpdateResult>;
