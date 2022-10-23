/// <reference types="node" />
import { AP } from 'activitypub-core-types';
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
import { DeliveryService } from 'activitypub-core-delivery';
export declare function inboxHandler(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database, deliveryService: DeliveryService): Promise<{
    props?: {
        entity?: AP.Entity;
        actor?: AP.Actor;
    };
} | {
    props: {};
}>;
export declare class InboxEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    databaseService: Database;
    deliveryService: DeliveryService;
    activity: AP.Activity | null;
    actor: AP.Actor | null;
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
    constructor(req: IncomingMessage, res: ServerResponse, databaseService: Database, deliveryService: DeliveryService);
    handlePost(): Promise<{
        props: {};
    }>;
}
