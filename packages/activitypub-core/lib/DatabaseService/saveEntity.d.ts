import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types/src';
export declare function saveEntity(this: DatabaseService, entity: AP.Entity): Promise<import("bson").Document | import("mongodb").UpdateResult>;
