/// <reference types="node" />
import * as AP from '@activity-kit/types';
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
export declare class InboxPostEndpoint {
    readonly core: CoreLibrary;
    activity: AP.Activity;
    url: URL;
    routes: Routes;
    plugins?: Plugin[];
    constructor(core: CoreLibrary, options: {
        body: Record<string, unknown>;
        url: URL;
        routes: Routes;
        plugins?: Plugin[];
    });
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
