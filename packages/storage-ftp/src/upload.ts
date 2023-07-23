import type { File } from 'formidable';
import { default as FtpClient } from 'ftp';
import { FtpStorageAdapter } from '.';
import { assert } from '@activity-kit/type-utilities';

export async function upload(this: FtpStorageAdapter, file: File) {
  return await new Promise<URL>((resolve, reject) => {
    const client = new FtpClient();
    const { host, path = '/', user, password } = this.params;

    assert.isString(host);
    assert.isString(user);
    assert.isString(password);
    assert.isString(path);

    client.on('ready', () => {
      client.put(file.filepath, file.newFilename, (error) => {
        client.end();

        if (error) {
          reject(error);
        } else {
          resolve(new URL(`https://${host}${path}/${file.newFilename}`));
        }
      });
    });

    client.connect({
      host,
      user,
      password,
    });
  });
}
