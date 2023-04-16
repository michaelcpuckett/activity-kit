/// <reference types="node" />
import { AP, Routes, Plugin, Library } from '@activity-kit/types';
import type { IncomingMessage, ServerResponse } from 'http';
import { runSideEffects } from './runSideEffects';
import { authenticateActor } from './authenticateActor';
import { wrapInActivity } from './wrapInActivity';
import { saveActivity } from './saveActivity';
import { parseBody } from './parseBody';
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
  routes: Routes;
  req: IncomingMessage;
  res: ServerResponse;
  core: CoreLibrary;
  plugins?: Plugin[];
  actor: AP.Actor | null;
  activity: AP.Entity | null;
  constructor(
    routes: Routes,
    req: IncomingMessage,
    res: ServerResponse,
    core: CoreLibrary,
    plugins?: Plugin[],
  );
  protected authenticateActor: typeof authenticateActor;
  protected getActor: typeof getActor;
  protected runSideEffects: typeof runSideEffects;
  protected saveActivity: typeof saveActivity;
  protected wrapInActivity: typeof wrapInActivity;
  protected parseBody: typeof parseBody;
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
