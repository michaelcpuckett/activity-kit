import { MongoDatabase } from '.';
export declare function findStringValueById(
  this: MongoDatabase,
  dbCollection: string,
  _id: string,
): Promise<string>;
