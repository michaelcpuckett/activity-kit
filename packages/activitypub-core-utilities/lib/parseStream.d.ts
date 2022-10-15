/// <reference types="node" />
import { IncomingMessage } from 'http';
import { AP } from 'activitypub-core-types';
export declare function parseStream(req: IncomingMessage): Promise<AP.Entity>;
