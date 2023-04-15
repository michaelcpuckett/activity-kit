/// <reference types="node" />
import { Library, AP, Plugin, Routes } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { File } from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';
import { cleanup } from './cleanup';
import { saveActivity } from './saveActivity';
export declare class UploadMediaPostEndpoint {
    routes: Routes;
    req: IncomingMessage;
    res: ServerResponse;
    lib: Library;
    plugins?: Plugin[];
    actor: AP.Actor | null;
    activity: (AP.Create & {
        object: AP.Image | AP.Document | AP.Video | AP.Audio;
    }) | null;
    file: File | null;
    protected getActor: typeof getActor;
    protected authenticateActor: typeof authenticateActor;
    protected parseBody: typeof parseBody;
    protected cleanup: typeof cleanup;
    protected saveActivity: typeof saveActivity;
    constructor(routes: Routes, req: IncomingMessage, res: ServerResponse, lib: Library, plugins?: Plugin[]);
    respond(): Promise<void>;
}
