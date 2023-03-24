import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare const getStreamByName: (this: SqliteDbAdapter, actor: AP.Actor, name: string) => Promise<AP.Collection | AP.OrderedCollection | null>;
