import { MongoDatabaseAdapterDb } from '.';
import { AP } from 'activitypub-core-types';
export declare function saveEntity(this: MongoDatabaseAdapterDb, entity: AP.Entity): Promise<import("bson").Document | import("mongodb").UpdateResult>;
