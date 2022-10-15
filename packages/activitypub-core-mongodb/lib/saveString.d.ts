import { MongoDatabase } from '.';
export declare function saveString(this: MongoDatabase, dbCollection: string, _id: string, value: string): Promise<import("bson").Document | import("mongodb").UpdateResult>;
