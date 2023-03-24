/// <reference types="./vendor-typings/sqlite3" />
import { SqliteDbAdapter } from '.';
export declare function saveString(this: SqliteDbAdapter, dbCollection: string, _id: string, value: string): Promise<import("sqlite").ISqlite.RunResult<import("sqlite3").Statement>>;
