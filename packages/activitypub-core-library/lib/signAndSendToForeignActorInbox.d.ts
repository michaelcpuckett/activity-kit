/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import { CoreLibrary } from '.';
export declare function signAndSendToForeignActorInbox(this: CoreLibrary, foreignActorInbox: URL, actor: AP.Actor, activity: AP.Activity): Promise<unknown>;
