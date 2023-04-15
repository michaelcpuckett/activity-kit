import { Adapters, AP, Plugin, Routes } from 'activitypub-core-types';
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

export class InboxPostEndpoint {
  routes: Routes;
  req: IncomingMessage;
  res: ServerResponse;
  layers: {
    auth: AuthLayer;
    data: DataLayer;
    storage: StorageLayer;
  };
  plugins?: Plugin[];
  activity: AP.Entity | null = null;

  constructor(
    routes: Routes,
    req: IncomingMessage,
    res: ServerResponse,
    layers: {
      auth: AuthLayer;
      data: DataLayer;
      storage: StorageLayer;
    },
    plugins?: Plugin[],
  ) {
    this.routes = routes;
    this.req = req;
    this.res = res;
    this.layers = layers;
    this.plugins = plugins;
  }

  protected getActors = getActors;
  protected runSideEffects = runSideEffects;
  protected parseBody = parseBody;
  protected broadcastActivity = broadcastActivity;
  protected shouldForwardActivity = shouldForwardActivity;

  protected handleCreate = handleCreate;
  protected handleAccept = handleAccept;
  protected handleAnnounce = handleAnnounce;
  protected handleFollow = handleFollow;
  protected handleLike = handleLike;

  protected isBlocked = isBlocked;

  public respond = respond;
}
