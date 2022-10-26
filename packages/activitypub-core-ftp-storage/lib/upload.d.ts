/// <reference types="node" />
import type { File } from 'formidable';
import { FtpStorage } from '.';
export declare function upload(this: FtpStorage, file: File): Promise<URL>;
