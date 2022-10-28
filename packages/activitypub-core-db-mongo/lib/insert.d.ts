/// <reference types="node" />
import { MongoDatabaseAdapterDb } from '.';
export declare function insertOrderedItem(this: MongoDatabaseAdapterDb, path: URL, url: URL): Promise<void>;
export declare function removeOrderedItem(this: MongoDatabaseAdapterDb, path: URL, url: URL): Promise<void>;
export declare function insertItem(this: MongoDatabaseAdapterDb, path: URL, url: URL): Promise<void>;
export declare function removeItem(this: MongoDatabaseAdapterDb, path: URL, url: URL): Promise<void>;
