/// <reference types="node" />
import { MongoDbAdapter } from '.';
export declare function insertOrderedItem(this: MongoDbAdapter, path: URL, url: URL): Promise<void>;
export declare function removeOrderedItem(this: MongoDbAdapter, path: URL, url: URL): Promise<void>;
export declare function insertItem(this: MongoDbAdapter, path: URL, url: URL): Promise<void>;
export declare function removeItem(this: MongoDbAdapter, path: URL, url: URL): Promise<void>;
