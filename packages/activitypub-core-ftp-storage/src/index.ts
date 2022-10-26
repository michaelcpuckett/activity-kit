import type { Storage } from 'activitypub-core-types';
import { upload } from './upload';
import { default as FtpClient } from 'ftp';

export class FtpStorage implements Storage {
  config: FtpClient.Options;
  public upload = upload;

  constructor(config: FtpClient.Options) {
    this.config = config;
  }
}
