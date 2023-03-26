import { AP } from 'activitypub-core-types';
import { DeliveryAdapter } from '.';
export declare function signAndSendToForeignActorInbox(this: DeliveryAdapter, foreignActorInbox: URL, actor: AP.Actor, activity: AP.Activity): Promise<void | Response>;
