/// <reference types="node" />
import { AP, Plugin, Routes } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import { getActors } from './getActors';
import { parseBody } from './parseBody';
import { respond } from './respond';
import { isBlocked } from './isBlocked';
import { runSideEffects } from './runSideEffects';
import { handleAccept } from './sideEffects/accept';
import { handleAnnounce } from './sideEffects/announce';
import { handleFollow } from './sideEffects/follow';
import { handleLike } from './sideEffects/like';
import { handleCreate } from './sideEffects/create';
import { shouldForwardActivity } from './shouldForwardActivity';
import { broadcastActivity } from './broadcastActivity';
import { AuthLayer } from 'activitypub-core-auth-layer';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';
export declare class InboxPostEndpoint {
    routes: Routes;
    req: IncomingMessage;
    res: ServerResponse;
    layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    };
    plugins?: Plugin[];
    activity: AP.Entity | null;
    constructor(routes: Routes, req: IncomingMessage, res: ServerResponse, layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    }, plugins?: Plugin[]);
    protected getActors: typeof getActors;
    protected runSideEffects: typeof runSideEffects;
    protected parseBody: typeof parseBody;
    protected broadcastActivity: typeof broadcastActivity;
    protected shouldForwardActivity: typeof shouldForwardActivity;
    protected handleCreate: typeof handleCreate;
    protected handleAccept: typeof handleAccept;
    protected handleAnnounce: typeof handleAnnounce;
    protected handleFollow: typeof handleFollow;
    protected handleLike: typeof handleLike;
    protected isBlocked: typeof isBlocked;
    respond: typeof respond;
}
