/// <reference types="node" />
import { IncomingMessage } from 'http';
export declare function streamToString(
  stream: IncomingMessage,
): Promise<string>;
