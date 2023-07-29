/// <reference types="node" />
import type { IncomingMessage } from 'http';
import * as AP from '@activity-kit/types';
export declare function parseStream(req: IncomingMessage): Promise<AP.Entity | null>;
