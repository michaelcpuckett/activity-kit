import * as formidable from 'formidable';
import { UploadMediaEndpoint } from '.';

export async function parseBody(this: UploadMediaEndpoint) {
  const form = formidable.default({
    multiples: true,
  });

  const {
    fields,
    files,
  } = await new Promise<{
    files: formidable.Files,
    fields: formidable.Fields,
  }>((resolve, reject) => {
    form.parse(this.req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          fields,
          files,
        });
      }
    });
  });

  if (typeof fields.object === 'string') {
    this.object = JSON.parse(fields.object);
  }

  console.log(files);
}