import * as AP from '@activity-kit/types';
import { cast } from '@activity-kit/type-utilities';
import { convertJsonToEntity } from '@activity-kit/utilities';
import { CoreLibrary, Plugin, Routes } from '@activity-kit/core';

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

export class InboxPostEndpoint {
  activity: AP.Activity;
  url: URL;
  routes: Routes;
  plugins?: Plugin[];

  constructor(
    readonly core: CoreLibrary,
    options: {
      body: Record<string, unknown>;
      url: URL;
      routes: Routes;
      plugins?: Plugin[];
    },
  ) {
    const activity = cast.isApActivity(convertJsonToEntity(options.body));

    if (!activity) {
      throw new Error('Body must be an Activity.');
    }

    this.activity = activity;
    this.url = options.url;
    this.routes = options.routes;
    this.plugins = [];
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
