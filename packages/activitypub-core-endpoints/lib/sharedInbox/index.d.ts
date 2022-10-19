/// <reference types="node" />
/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import { DeliveryService } from 'activitypub-core-delivery';
export declare function sharedInboxHandler(req: IncomingMessage, res: ServerResponse, databaseService: Database, deliveryService: DeliveryService): Promise<void>;
export declare function getRecipientInboxIds(activity: AP.Activity, actor: AP.Actor, databaseService: Database, providedDeliveryService: DeliveryService): Promise<URL[]>;
