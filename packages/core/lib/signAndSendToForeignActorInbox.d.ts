/// <reference types="node" />
import * as AP from '@activity-kit/types';
import { Core } from '.';
export declare function signAndSendToForeignActorInbox(this: Core, foreignActorInbox: URL, actor: AP.Actor, activity: AP.Activity): Promise<unknown>;
