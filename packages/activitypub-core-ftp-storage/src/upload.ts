import type { File } from 'formidable';
import { default as FtpClient } from 'ftp';

export async function upload(file: File) {
  return await new Promise<URL>((resolve, reject) => {
    const client = new FtpClient();
    client.on('ready', function() {
      client.put(file.filepath, file.newFilename, error => {
        client.end();

        if (error) {
          reject(error);
        } else {
          resolve(new URL(`https://${this.config.host}/${file.newFilename}`));
        }
      });
    });
    client.connect(this.config);
  });
}