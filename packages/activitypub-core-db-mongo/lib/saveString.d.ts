import { MongoDbAdapter } from '.';
export declare function saveString(this: MongoDbAdapter, dbCollection: string, _id: string, value: string): Promise<import("bson").Document | import("mongodb").UpdateResult>;
