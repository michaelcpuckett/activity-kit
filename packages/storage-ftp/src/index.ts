import { StorageAdapter } from '@activity-kit/core';
import { upload } from './upload';
import { default as FtpClient } from 'ftp';

export class FtpStorageAdapter implements StorageAdapter {
  params: {
    [key: string]: unknown;
  };

  public upload = upload;

  constructor(params: FtpClient.Options & { path?: string }) {
    this.params = {
      host: params.host,
      user: params.user,
      password: params.password,
      path: params.path,
    };
  }
}
