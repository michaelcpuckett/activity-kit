/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { AuthAdapter, DbAdapter, Plugin } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import { DeliveryAdapter } from 'activitypub-core-delivery';
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
import { handleBlock } from './sideEffects/block';
import { handleAdd } from './sideEffects/add';
import { handleUndo } from './sideEffects/undo';
import { handleRemove } from './sideEffects/remove';
import { handleUndoLike } from './sideEffects/undo/undoLike';
import { handleUndoAnnounce } from './sideEffects/undo/undoAnnounce';
export declare class OutboxPostEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        auth: AuthAdapter;
        db: DbAdapter;
        delivery: DeliveryAdapter;
    };
    plugins?: Plugin[];
    actor: AP.Actor | null;
    activity: AP.Entity | null;
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        auth: AuthAdapter;
        db: DbAdapter;
        delivery: DeliveryAdapter;
    }, plugins?: Plugin[]);
    respond(): Promise<void>;
    protected authenticateActor: typeof authenticateActor;
    protected getActor: typeof getActor;
    protected runSideEffects: typeof runSideEffects;
    protected saveActivity: typeof saveActivity;
    protected wrapInActivity: typeof wrapInActivity;
    protected parseBody: typeof parseBody;
    protected handleAdd: typeof handleAdd;
    protected handleAnnounce: typeof handleAnnounce;
    protected handleBlock: typeof handleBlock;
    protected handleCreate: typeof handleCreate;
    protected handleDelete: typeof handleDelete;
    protected handleLike: typeof handleLike;
    protected handleRemove: typeof handleRemove;
    protected handleUpdate: typeof handleUpdate;
    protected handleUndo: typeof handleUndo;
    protected handleUndoLike: typeof handleUndoLike;
    protected handleUndoAnnounce: typeof handleUndoAnnounce;
}
