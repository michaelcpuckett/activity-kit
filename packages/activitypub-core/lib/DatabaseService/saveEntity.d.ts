import { DatabaseService } from '.';
import { AP } from '../types';
export declare function saveEntity(this: DatabaseService, entity: AP.Entity): Promise<import("bson").Document | import("mongodb").UpdateResult>;
