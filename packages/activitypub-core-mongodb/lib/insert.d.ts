/// <reference types="node" />
import { MongoDatabase } from '.';
export declare function insertOrderedItem(
  this: MongoDatabase,
  path: URL,
  url: URL,
): Promise<void>;
export declare function removeOrderedItem(
  this: MongoDatabase,
  path: URL,
  url: URL,
): Promise<void>;
export declare function insertItem(
  this: MongoDatabase,
  path: URL,
  url: URL,
): Promise<void>;
export declare function removeItem(
  this: MongoDatabase,
  path: URL,
  url: URL,
): Promise<void>;
