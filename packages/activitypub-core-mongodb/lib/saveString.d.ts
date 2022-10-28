import { MongoDatabaseAdapterDb } from '.';
export declare function saveString(this: MongoDatabaseAdapterDb, dbCollection: string, _id: string, value: string): Promise<import("bson").Document | import("mongodb").UpdateResult>;
