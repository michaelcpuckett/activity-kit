/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';
export declare function userPostHandler(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database, setup?: (actor: AP.Entity, databaseService: Database) => Promise<{
    actor: AP.Actor;
}>): Promise<void>;
