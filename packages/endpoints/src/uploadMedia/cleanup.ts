import { UploadMediaPostEndpoint } from '.';
import * as fs from 'fs';

export async function cleanup(this: UploadMediaPostEndpoint) {
  await new Promise((resolve, reject) => {
    if (this.file?.filepath) {
      fs.unlink(this.file.filepath, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(void 0);
        }
      });
    }
  });
}
