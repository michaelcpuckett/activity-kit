/// <reference types="node" />
import { AP, Plugin } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';
import { getActor } from './getActor';
import { saveActivity } from './saveActivity';
import { parseBody } from './parseBody';
import { runSideEffects } from './runSideEffects';
import { handleAccept } from './sideEffects/accept';
import { handleAnnounce } from './sideEffects/announce';
import { handleFollow } from './sideEffects/follow';
import { handleLike } from './sideEffects/like';
import { handleCreate } from './sideEffects/create';
import { shouldForwardActivity } from './shouldForwardActivity';
import { broadcastActivity } from './broadcastActivity';
import { DeliveryAdapter } from 'activitypub-core-delivery';
export declare class InboxPostEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        authentication: Auth;
        database: Database;
        delivery: DeliveryAdapter;
    };
    plugins?: Plugin[];
    actor: AP.Actor | null;
    activity: AP.Entity | null;
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        authentication: Auth;
        database: Database;
        delivery: DeliveryAdapter;
    }, plugins?: Plugin[]);
    protected getActor: typeof getActor;
    protected runSideEffects: typeof runSideEffects;
    protected parseBody: typeof parseBody;
    protected saveActivity: typeof saveActivity;
    protected broadcastActivity: typeof broadcastActivity;
    protected shouldForwardActivity: typeof shouldForwardActivity;
    protected handleCreate: typeof handleCreate;
    protected handleAccept: typeof handleAccept;
    protected handleAnnounce: typeof handleAnnounce;
    protected handleFollow: typeof handleFollow;
    protected handleLike: typeof handleLike;
    respond(): Promise<void>;
}
