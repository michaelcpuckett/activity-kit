/// <reference types="node" />
import { DeliveryService } from '.';
import { AP } from 'activitypub-core-types';
export declare function getRecipientInboxUrls(
  this: DeliveryService,
  activity: AP.Activity,
  actor: AP.Actor,
): Promise<URL[]>;
