import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare const getStreamByName: (this: MongoDbAdapter, actor: AP.Actor, name: string) => Promise<AP.Collection | AP.OrderedCollection | null>;
