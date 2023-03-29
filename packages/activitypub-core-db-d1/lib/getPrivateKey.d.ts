import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getPrivateKey(this: D1DbAdapter, actor: AP.Actor): Promise<string>;
