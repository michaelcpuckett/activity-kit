import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
export declare function saveEntity(this: MongoDatabase, entity: AP.Entity): Promise<import("bson").Document | import("mongodb").UpdateResult>;
