import type { Storage } from 'activitypub-core-types';
import { upload } from './upload';
import { default as FtpClient } from 'ftp';
export declare class FtpStorage implements Storage {
    config: FtpClient.Options;
    upload: typeof upload;
    constructor(config: FtpClient.Options);
}
