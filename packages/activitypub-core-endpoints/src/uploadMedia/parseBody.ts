import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT, getGuid, LOCAL_DOMAIN, PUBLIC_ACTOR } from 'activitypub-core-utilities';
import * as formidable from 'formidable';
import { UploadMediaPostEndpoint } from '.';

export async function parseBody(this: UploadMediaPostEndpoint) {
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

  if (typeof fields.object === 'string' && (files.file && !Array.isArray(files.file))) {
    this.file = files.file;

    const objectId = `${LOCAL_DOMAIN}/object/${getGuid()}`;
    const activityId = `${LOCAL_DOMAIN}/activity/${getGuid()}`;

    const object: AP.Image | AP.Document | AP.Audio | AP.Video = {
      "@context": ACTIVITYSTREAMS_CONTEXT,
      to: new URL(PUBLIC_ACTOR),
      type: getType(this.file.mimetype),
      mediaType: this.file.mimetype,
      ...JSON.parse(fields.object),
      id: new URL(objectId),
      attributedTo: this.actor.id,
    };

    this.activity = {
      "@context": ACTIVITYSTREAMS_CONTEXT,
      to: new URL(PUBLIC_ACTOR),
      type: 'Create',
      id: new URL(activityId),
      url: new URL(activityId),
      actor: this.actor.id,
      object,
    };
  }
}

function getType(mimeType: string) {
  if (mimeType.startsWith('image')) {
    return 'Image';
  }

  if (mimeType.startsWith('video')) {
    return 'Video';
  }

  if (mimeType.startsWith('audio')) {
    return 'Audio';
  }

  return 'Document';
}