import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare const getStreamByName: (this: DataLayer, actor: AP.Actor, name: string) => Promise<AP.Collection | AP.OrderedCollection | null>;
