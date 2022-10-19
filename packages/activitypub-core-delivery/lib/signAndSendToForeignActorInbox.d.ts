/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import { DeliveryService } from '.';
export declare function signAndSendToForeignActorInbox(
  this: DeliveryService,
  foreignActorInbox: URL,
  actor: AP.Actor,
  activity: AP.Activity,
): Promise<any>;
