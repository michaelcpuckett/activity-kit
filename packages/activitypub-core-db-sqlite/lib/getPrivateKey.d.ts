import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getPrivateKey(this: SqliteDbAdapter, actor: AP.Actor): Promise<string>;
