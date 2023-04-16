import type { StorageAdapter } from '@activity-kit/types';
import { upload } from './upload';
import { default as FtpClient } from 'ftp';
export declare class FtpStorageAdapter implements StorageAdapter {
    params: {
        [key: string]: unknown;
    };
    upload: typeof upload;
    constructor(params: FtpClient.Options & {
        path?: string;
    });
}
