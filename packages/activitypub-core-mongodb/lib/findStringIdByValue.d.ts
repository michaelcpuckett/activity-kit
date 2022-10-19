import { MongoDatabase } from '.';
export declare function findStringIdByValue(
  this: MongoDatabase,
  dbCollection: string,
  value: string,
): Promise<string>;
