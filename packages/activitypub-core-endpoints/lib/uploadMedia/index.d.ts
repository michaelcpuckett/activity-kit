/// <reference types="node" />
import { Adapters, AP, Plugin } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import formidable from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';
import { cleanup } from './cleanup';
import { saveActivity } from './saveActivity';
export declare class UploadMediaPostEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: Adapters;
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
    constructor(req: IncomingMessage, res: ServerResponse, adapters: Adapters, plugins?: Plugin[]);
    respond(): Promise<void>;
}
