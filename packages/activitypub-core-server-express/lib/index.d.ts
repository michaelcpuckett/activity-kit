import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { AP, Plugin } from 'activitypub-core-types';
import { DeliveryAdapter } from 'activitypub-core-delivery';
import type { DbAdapter, AuthAdapter, StorageAdapter } from 'activitypub-core-types';
export declare const activityPub: (config: {
    routes?: {
        actor?: string | ((actor: string) => string);
        inbox?: string | ((actor: string) => string);
        outbox?: string | ((actor: string) => string);
        followers?: string | ((actor: string) => string);
        following?: string | ((actor: string) => string);
        liked?: string | ((actor: string) => string);
        shared?: string | ((actor: string) => string);
        blocked?: string | ((actor: string) => string);
        uploadMedia?: string | ((actor: string) => string);
        activity?: string | ((id: string, type: string) => string);
        object?: string | ((id: string, type: string) => string);
        likes?: string | ((id: string, type: string) => string);
        shares?: string | ((id: string, type: string) => string);
        replies?: string | ((id: string, type: string) => string);
    };
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
        auth: AuthAdapter;
        db: DbAdapter;
        delivery: DeliveryAdapter;
        storage: StorageAdapter;
    };
    plugins?: Plugin[];
}) => (req: IncomingMessage & {
    hostname: string;
}, res: ServerResponse, next: NextFunction) => Promise<void>;
