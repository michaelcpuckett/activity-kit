import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { Adapters, AP, Plugin } from 'activitypub-core-types';
import type { Routes } from 'activitypub-core-types';
export declare const activityPub: (config: {
    routes?: Partial<Routes>;
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
    adapters: Adapters;
    plugins?: Plugin[];
}) => (req: IncomingMessage & {
    hostname: string;
}, res: ServerResponse, next: NextFunction) => Promise<void>;
