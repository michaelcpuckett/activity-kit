import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { AP } from 'activitypub-core-types';
import type { ServiceAccount } from 'firebase-admin';
import { DeliveryService } from 'activitypub-core-delivery';
import type { Database } from 'activitypub-core-types/index';
export declare const activityPub: ({ renderIndex, renderHome, renderEntity, }: {
    renderIndex: () => Promise<string>;
    renderHome: ({ actor }: {
        actor: AP.Actor;
    }) => Promise<string>;
    renderEntity: ({ entity, actor }: {
        entity: AP.Entity;
        actor?: AP.Actor;
    }) => Promise<string>;
}, { serviceAccount, databaseService, deliveryService, }: {
    serviceAccount: ServiceAccount;
    databaseService: Database;
    deliveryService: DeliveryService;
}) => (req: IncomingMessage, res: ServerResponse, next: NextFunction) => Promise<void>;
