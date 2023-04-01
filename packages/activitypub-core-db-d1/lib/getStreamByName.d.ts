import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getStreamByName(this: D1DbAdapter, actor: AP.Actor, name: string): Promise<AP.Collection | AP.OrderedCollection | null>;
