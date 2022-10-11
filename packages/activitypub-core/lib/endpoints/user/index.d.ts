/// <reference types="node" />
import { DatabaseService } from '../../DatabaseService';
import { ServiceAccount } from 'firebase-admin';
import { AP } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
export declare function userPostHandler(req: IncomingMessage, res: ServerResponse, serviceAccount: ServiceAccount, setup?: (actor: AP.Entity, databaseService: DatabaseService) => Promise<{
    actor: AP.Actor;
}>): Promise<void>;
