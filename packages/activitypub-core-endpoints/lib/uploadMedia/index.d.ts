/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { Auth, Database, Storage } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import formidable from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';
import { cleanup } from './cleanup';
export declare function uploadMediaHandler(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database, storageService: Storage): Promise<void>;
export declare class UploadMediaEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    authenticationService: Auth;
    databaseService: Database;
    storageService: Storage;
    actor: AP.Actor | null;
    object: AP.Entity | null;
    file: formidable.File | null;
    protected getActor: typeof getActor;
    protected authenticateActor: typeof authenticateActor;
    protected parseBody: typeof parseBody;
    protected cleanup: typeof cleanup;
    constructor(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database, storageService: Storage);
    handlePost(): Promise<void>;
}
