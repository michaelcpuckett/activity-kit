import * as AP from '@activity-kit/types';
import { Routes, Plugin, CoreLibrary } from '@activity-kit/core';
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

export class OutboxPostEndpoint {
  body: Record<string, unknown>;
  url: URL;
  routes: Routes;
  plugins?: Plugin[];
  actor: AP.Actor;

  activity: AP.Entity | null = null;

  constructor(
    readonly core: CoreLibrary,
    options: {
      body: Record<string, unknown>;
      url: URL;
      actor: AP.Actor;
      routes: Routes;
      plugins?: Plugin[];
    },
  ) {
    this.core = core;
    this.actor = options.actor;
    this.body = options.body;
    this.url = options.url;
    this.routes = options.routes;
    this.plugins = options.plugins;
  }

  protected getActor = getActor;
  protected runSideEffects = runSideEffects;
  protected saveActivity = saveActivity;
  protected wrapInActivity = wrapInActivity;
  protected combineAddresses = combineAddresses;
  public respond = respond;

  protected handleAdd = handleAdd;
  protected handleAnnounce = handleAnnounce;
  protected handleAccept = handleAccept;
  protected handleBlock = handleBlock;
  protected handleCreate = handleCreate;
  protected handleDelete = handleDelete;
  protected handleLike = handleLike;
  protected handleRemove = handleRemove;
  protected handleUpdate = handleUpdate;

  protected handleUndo = handleUndo;
  protected handleUndoLike = handleUndoLike;
  protected handleUndoFollow = handleUndoFollow;
  protected handleUndoAccept = handleUndoAccept;
  protected handleUndoAnnounce = handleUndoAnnounce;
  protected handleUndoBlock = handleUndoBlock;
}
