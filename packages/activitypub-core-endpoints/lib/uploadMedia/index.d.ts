/// <reference types="node" />
import { AP, Plugin, Routes } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import formidable from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';
import { cleanup } from './cleanup';
import { saveActivity } from './saveActivity';
import { AuthLayer } from 'activitypub-core-auth-layer';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';
export declare class UploadMediaPostEndpoint {
    routes: Routes;
    req: IncomingMessage;
    res: ServerResponse;
    layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    };
    plugins?: Plugin[];
    actor: AP.Actor | null;
    activity: (AP.Create & {
        object: AP.Image | AP.Document | AP.Video | AP.Audio;
    }) | null;
    file: formidable.File | null;
    protected getActor: typeof getActor;
    protected authenticateActor: typeof authenticateActor;
    protected parseBody: typeof parseBody;
    protected cleanup: typeof cleanup;
    protected saveActivity: typeof saveActivity;
    constructor(routes: Routes, req: IncomingMessage, res: ServerResponse, layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    }, plugins?: Plugin[]);
    respond(): Promise<void>;
}
