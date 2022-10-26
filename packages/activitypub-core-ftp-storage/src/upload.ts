import type { File } from 'formidable';
import { default as FtpClient } from 'ftp';
import { FtpStorage } from '.';

export async function upload(this: FtpStorage, file: File) {
  return await new Promise<URL>((resolve, reject) => {
    const client = new FtpClient();
    client.on('ready', function() {
      client.put(file.filepath, file.newFilename, error => {
        client.end();

        if (error) {
          reject(error);
        } else {
          resolve(new URL(`https://${this.host}/${file.newFilename}`));
        }
      });
    });
    client.connect({
      host: this.host,
      user: this.user,
      password: this.password,
    });
  });
}