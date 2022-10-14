/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import { ServiceAccount } from 'firebase-admin';
export declare function entityGetHandler(request: IncomingMessage, response: ServerResponse, serviceAccount: ServiceAccount, databaseService: Database): Promise<{
    props?: {
        entity?: AP.Entity;
        actor?: AP.Actor;
    };
}>;