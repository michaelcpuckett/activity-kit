import { AP } from 'activitypub-core-types';
import { getGuid, LOCAL_DOMAIN, PUBLIC_ACTOR } from 'activitypub-core-utilities';
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
    const objectId = `${LOCAL_DOMAIN}/object/${getGuid()}`;

    this.object = {
      ...JSON.parse(fields.object),
      type: 'Image',
      id: new URL(objectId),
      url: new URL(`/uploads/${this.file.newFilename}`),
      attributedTo: this.actor.id,
      published: new Date(),
    };
  }

  if (files.file && !Array.isArray(files.file)) {
    this.file = files.file;
  }
}