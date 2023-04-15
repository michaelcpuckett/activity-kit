/// <reference types="node" />
import { SqliteDbAdapter } from '.';
export declare function insertOrderedItem(this: SqliteDbAdapter, path: URL, url: URL): Promise<void>;
export declare function removeOrderedItem(this: SqliteDbAdapter, path: URL, url: URL): Promise<void>;
export declare function insertItem(this: SqliteDbAdapter, path: URL, url: URL): Promise<void>;
export declare function removeItem(this: SqliteDbAdapter, path: URL, url: URL): Promise<void>;
