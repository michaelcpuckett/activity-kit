/// <reference types="node" />
import { IncomingMessage } from 'http';
import { AP } from '@activity-kit/types';
export declare function parseStream(req: IncomingMessage): Promise<AP.Entity>;
