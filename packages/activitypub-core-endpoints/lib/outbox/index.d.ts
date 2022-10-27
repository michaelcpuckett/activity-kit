/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { Auth, Database, Plugin } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import { DeliveryService } from 'activitypub-core-delivery';
import { runSideEffects } from './runSideEffects';
import { authenticateActor } from './authenticateActor';
import { wrapInActivity } from './wrapInActivity';
import { saveActivity } from './saveActivity';
import { parseBody } from './parseBody';
import { getActor } from './getActor';
import { handleDelete } from './sideEffects/delete';
import { handleCreate } from './sideEffects/create';
import { handleUpdate } from './sideEffects/update';
import { handleLike } from './sideEffects/like';
import { handleAnnounce } from './sideEffects/announce';
import { handleAdd } from './sideEffects/add';
import { handleUndo } from './sideEffects/undo';
import { handleRemove } from './sideEffects/remove';
import { handleUndoLike } from './sideEffects/undo/undoLike';
import { handleUndoAnnounce } from './sideEffects/undo/undoAnnounce';
export declare function outboxHandler(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database, deliveryService: DeliveryService, plugins?: Plugin[]): Promise<{
    props?: {
        entity?: AP.Entity;
        actor?: AP.Actor;
    };
}>;
export declare class OutboxPostHandler {
    req: IncomingMessage;
    res: ServerResponse;
    authenticationService: Auth;
    databaseService: Database;
    deliveryService: DeliveryService;
    plugins?: Plugin[];
    actor: AP.Actor | null;
    activity: AP.Entity | null;
    constructor(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database, deliveryService: DeliveryService, plugins?: Plugin[]);
    init(): Promise<void>;
    protected authenticateActor: typeof authenticateActor;
    protected getActor: typeof getActor;
    protected runSideEffects: typeof runSideEffects;
    protected saveActivity: typeof saveActivity;
    protected wrapInActivity: typeof wrapInActivity;
    protected parseBody: typeof parseBody;
    protected handleAdd: typeof handleAdd;
    protected handleAnnounce: typeof handleAnnounce;
    protected handleCreate: typeof handleCreate;
    protected handleDelete: typeof handleDelete;
    protected handleLike: typeof handleLike;
    protected handleRemove: typeof handleRemove;
    protected handleUpdate: typeof handleUpdate;
    protected handleUndo: typeof handleUndo;
    protected handleUndoLike: typeof handleUndoLike;
    protected handleUndoAnnounce: typeof handleUndoAnnounce;
}
