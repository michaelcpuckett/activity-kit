/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';
import { DeliveryService } from 'activitypub-core-delivery';
export declare function inboxHandler(
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  deliveryService: DeliveryService,
): Promise<
  | {
      props?: {
        entity?: AP.Entity;
        actor?: AP.Actor;
      };
    }
  | {
      props: {};
    }
>;
