/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { Auth, Database } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import { DeliveryService } from 'activitypub-core-delivery';
export declare function outboxHandler(
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
