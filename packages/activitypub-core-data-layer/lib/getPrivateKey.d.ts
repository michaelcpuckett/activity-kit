import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function getPrivateKey(this: DataLayer, actor: AP.Actor): Promise<string>;
