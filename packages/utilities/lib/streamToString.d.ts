/// <reference types="node" />
import { IncomingMessage } from 'http';
/**
 * Converts an HTTP stream to a string.
 *
 * @returns The string.
 *
 * @todo This is being depricated in favor of having adapters handle this.
 */
export declare function streamToString(stream: IncomingMessage): Promise<string>;
