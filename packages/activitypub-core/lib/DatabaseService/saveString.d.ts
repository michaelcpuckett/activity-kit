import { DatabaseService } from '.';
export declare function saveString(this: DatabaseService, dbCollection: string, _id: string, value: string): Promise<import("bson").Document | import("mongodb").UpdateResult>;
