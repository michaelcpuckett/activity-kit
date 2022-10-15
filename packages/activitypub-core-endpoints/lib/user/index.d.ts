/// <reference types="node" />
import { ServiceAccount } from 'firebase-admin';
import { AP } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database } from 'activitypub-core-types';
export declare function userPostHandler(req: IncomingMessage, res: ServerResponse, serviceAccount: ServiceAccount, databaseService: Database, setup?: (actor: AP.Entity, databaseService: Database) => Promise<{
    actor: AP.Actor;
}>): Promise<void>;
