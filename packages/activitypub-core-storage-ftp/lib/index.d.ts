import type { Storage } from 'activitypub-core-types';
import { upload } from './upload';
import { default as FtpClient } from 'ftp';
export declare class FtpStorageAdapter implements Storage {
    host: FtpClient.Options['host'];
    user: FtpClient.Options['user'];
    password: FtpClient.Options['password'];
    path?: string;
    upload: typeof upload;
    constructor(config: FtpClient.Options, path?: string);
}
