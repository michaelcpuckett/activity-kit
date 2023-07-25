import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { Adapters, AP, Plugin, Routes } from '@activity-kit/types';
export declare const activityKitPlugin: (config: {
    routes?: any;
    pages: {
        login: () => Promise<string>;
        home: ({ actor }: {
            actor: AP.Actor;
        }) => Promise<string>;
        entity: ({ entity, actor, }: {
            entity: AP.Entity;
            actor?: any;
        }) => Promise<string>;
    };
    adapters: Adapters;
    plugins?: Plugin[] | undefined;
}) => (req: IncomingMessage & {
    params: Record<string, string>;
}, res: ServerResponse, next: NextFunction) => Promise<void>;
