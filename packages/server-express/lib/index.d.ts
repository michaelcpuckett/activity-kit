import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { Adapters, AP, Plugin, Routes } from '@activity-kit/types';
export declare const activityKitPlugin: (config: {
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
    params: Record<string, string>;
}, res: ServerResponse, next: NextFunction) => Promise<void>;
