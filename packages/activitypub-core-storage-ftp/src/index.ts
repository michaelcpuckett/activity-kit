import type { StorageAdapter } from 'activitypub-core-types';
import { upload } from './upload';
import { default as FtpClient } from 'ftp';

export class FtpStorageAdapter implements StorageAdapter {
  host: FtpClient.Options['host'];
  user: FtpClient.Options['user'];
  password: FtpClient.Options['password'];
  path?: string;

  public upload = upload;

  constructor(config: FtpClient.Options, path?: string) {
    this.host = config.host;
    this.user = config.user;
    this.password = config.password;
    this.path = path;
  }
}
