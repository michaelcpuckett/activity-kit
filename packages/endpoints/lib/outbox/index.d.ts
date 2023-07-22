/// <reference types="node" />
import { AP, Routes, Plugin, CoreLibrary } from '@activity-kit/types';
import { runSideEffects } from './runSideEffects';
import { wrapInActivity } from './wrapInActivity';
import { combineAddresses } from './combineAddresses';
import { saveActivity } from './saveActivity';
import { getActor } from './getActor';
import { respond } from './respond';
import { handleDelete } from './sideEffects/delete';
import { handleCreate } from './sideEffects/create';
import { handleUpdate } from './sideEffects/update';
import { handleLike } from './sideEffects/like';
import { handleAnnounce } from './sideEffects/announce';
import { handleAccept } from './sideEffects/accept';
import { handleBlock } from './sideEffects/block';
import { handleAdd } from './sideEffects/add';
import { handleUndo } from './sideEffects/undo';
import { handleRemove } from './sideEffects/remove';
import { handleUndoBlock } from './sideEffects/undo/undoBlock';
import { handleUndoFollow } from './sideEffects/undo/undoFollow';
import { handleUndoAccept } from './sideEffects/undo/undoAccept';
import { handleUndoLike } from './sideEffects/undo/undoLike';
import { handleUndoAnnounce } from './sideEffects/undo/undoAnnounce';
export declare class OutboxPostEndpoint {
    readonly core: CoreLibrary;
    body: Record<string, unknown>;
    url: URL;
    routes: Routes;
    plugins?: Plugin[];
    actor: AP.Actor;
    activity: AP.Entity | null;
    constructor(core: CoreLibrary, options: {
        body: Record<string, unknown>;
        url: URL;
        actor: AP.Actor;
        routes: Routes;
        plugins?: Plugin[];
    });
    protected getActor: typeof getActor;
    protected runSideEffects: typeof runSideEffects;
    protected saveActivity: typeof saveActivity;
    protected wrapInActivity: typeof wrapInActivity;
    protected combineAddresses: typeof combineAddresses;
    respond: typeof respond;
    protected handleAdd: typeof handleAdd;
    protected handleAnnounce: typeof handleAnnounce;
    protected handleAccept: typeof handleAccept;
    protected handleBlock: typeof handleBlock;
    protected handleCreate: typeof handleCreate;
    protected handleDelete: typeof handleDelete;
    protected handleLike: typeof handleLike;
    protected handleRemove: typeof handleRemove;
    protected handleUpdate: typeof handleUpdate;
    protected handleUndo: typeof handleUndo;
    protected handleUndoLike: typeof handleUndoLike;
    protected handleUndoFollow: typeof handleUndoFollow;
    protected handleUndoAccept: typeof handleUndoAccept;
    protected handleUndoAnnounce: typeof handleUndoAnnounce;
    protected handleUndoBlock: typeof handleUndoBlock;
}
