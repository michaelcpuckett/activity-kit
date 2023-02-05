import type { File } from 'formidable';
import { FtpStorageAdapter } from '.';
export declare function upload(this: FtpStorageAdapter, file: File): Promise<URL>;
