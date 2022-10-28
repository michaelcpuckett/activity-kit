import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { AP, Plugin } from 'activitypub-core-types';
import { DeliveryAdapter } from 'activitypub-core-delivery';
import type { Database, Auth, Storage } from 'activitypub-core-types';
export declare const activityPub: (config: {
    pages: {
        login: () => Promise<string>;
        home: ({ actor }: {
            actor: AP.Actor;
        }) => Promise<string>;
        entity: ({ entity, actor, }: {
            entity: AP.Entity;
            actor?: AP.Actor;
        }) => Promise<string>;
    };
    adapters: {
        authentication: Auth;
        database: Database;
        delivery: DeliveryAdapter;
        storage: Storage;
    };
    plugins?: Plugin[];
}) => (req: IncomingMessage, res: ServerResponse, next: NextFunction) => Promise<void>;
