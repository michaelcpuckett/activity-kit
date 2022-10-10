/// <reference types="node" />
import { DatabaseService } from '.';
export declare function insertOrderedItem(this: DatabaseService, path: URL, url: URL): Promise<void>;
export declare function removeOrderedItem(this: DatabaseService, path: URL, url: URL): Promise<void>;
export declare function insertItem(this: DatabaseService, path: URL, url: URL): Promise<void>;
export declare function removeItem(this: DatabaseService, path: URL, url: URL): Promise<void>;
