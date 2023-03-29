import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare const getStreamByName: (this: D1DbAdapter, actor: AP.Actor, name: string) => Promise<AP.Collection | AP.OrderedCollection | null>;
