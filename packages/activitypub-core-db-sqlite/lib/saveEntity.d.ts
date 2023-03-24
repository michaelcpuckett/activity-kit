/// <reference types="./vendor-typings/sqlite3" />
import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function saveEntity(this: SqliteDbAdapter, entity: AP.Entity): Promise<import("sqlite").ISqlite.RunResult<import("sqlite3").Statement>>;
