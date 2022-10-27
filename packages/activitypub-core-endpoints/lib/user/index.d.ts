/// <reference types="node" />
import { Plugin } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';
export declare function userPostHandler(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database, plugins?: Plugin[]): Promise<void>;
