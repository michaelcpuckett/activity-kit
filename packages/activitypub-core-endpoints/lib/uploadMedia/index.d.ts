/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { Auth, Database } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import formidable from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';
export declare function uploadMediaHandler(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database): Promise<void>;
export declare class UploadMediaEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    authenticationService: Auth;
    databaseService: Database;
    actor: AP.Actor | null;
    object: AP.Entity | null;
    file: formidable.File | null;
    protected getActor: typeof getActor;
    protected authenticateActor: typeof authenticateActor;
    protected parseBody: typeof parseBody;
    constructor(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database);
    handlePost(): Promise<void>;
}
