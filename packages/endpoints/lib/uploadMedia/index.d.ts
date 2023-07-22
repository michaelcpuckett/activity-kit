/// <reference types="node" />
import { CoreLibrary, AP, Plugin, Routes } from '@activity-kit/types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { File } from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';
import { cleanup } from './cleanup';
import { saveActivity } from './saveActivity';
import { AnyTransitiveActivityType } from '@activity-kit/types/lib/activitypub';
export declare class UploadMediaPostEndpoint {
    routes: Routes;
    req: IncomingMessage;
    res: ServerResponse;
    core: CoreLibrary;
    plugins?: Plugin[];
    actor: AP.Actor | null;
    activity: AP.TransitiveActivity<AnyTransitiveActivityType> | null;
    file: File | null;
    protected getActor: typeof getActor;
    protected authenticateActor: typeof authenticateActor;
    protected parseBody: typeof parseBody;
    protected cleanup: typeof cleanup;
    protected saveActivity: typeof saveActivity;
    constructor(routes: Routes, req: IncomingMessage, res: ServerResponse, core: CoreLibrary, plugins?: Plugin[]);
    respond(): Promise<void>;
}
