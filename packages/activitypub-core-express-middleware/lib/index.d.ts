import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { AP } from 'activitypub-core-types/src';
import type { ServiceAccount } from 'firebase-admin';
export declare const activityPub: ({ renderIndex, renderHome, renderEntity, }: {
    renderIndex: () => Promise<string>;
    renderHome: ({ actor }: {
        actor: AP.Actor;
    }) => Promise<string>;
    renderEntity: ({ entity }: {
        entity: AP.Entity;
    }) => Promise<string>;
}, serviceAccount: ServiceAccount) => (req: IncomingMessage, res: ServerResponse, next: NextFunction) => Promise<void>;
