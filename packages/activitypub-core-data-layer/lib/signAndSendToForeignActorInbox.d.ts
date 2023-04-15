import { AP } from 'activitypub-core-types';
import { DataLayer } from '.';
export declare function signAndSendToForeignActorInbox(this: DataLayer, foreignActorInbox: URL, actor: AP.Actor, activity: AP.Activity): Promise<void | Response>;
