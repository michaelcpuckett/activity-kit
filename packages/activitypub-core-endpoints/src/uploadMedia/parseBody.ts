import { AP } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTEXT,
  LOCAL_DOMAIN,
  PUBLIC_ACTOR,
} from 'activitypub-core-utilities';
import * as formidable from 'formidable';
import { compile } from 'path-to-regexp';
import { UploadMediaPostEndpoint } from '.';

export async function parseBody(this: UploadMediaPostEndpoint) {
  const form = formidable.default({
    multiples: true,
  });

  const { fields, files } = await new Promise<{
    files: formidable.Files;
    fields: formidable.Fields;
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

  if (
    typeof fields.object === 'string' &&
    files.file &&
    !Array.isArray(files.file)
  ) {
    this.file = files.file;

    const activityId = new URL(
      `${LOCAL_DOMAIN}${compile(this.routes.create)({
        guid: await this.adapters.crypto.randomBytes(16),
      })}`,
    );

    const objectId = new URL(
      `${LOCAL_DOMAIN}${compile(
        this.routes[getType(this.file.mimetype).toLowerCase()],
      )({
        guid: await this.adapters.crypto.randomBytes(16),
      })}`,
    );

    const object: AP.Image | AP.Document | AP.Audio | AP.Video = {
      '@context': ACTIVITYSTREAMS_CONTEXT,
      to: new URL(PUBLIC_ACTOR),
      type: getType(this.file.mimetype),
      mediaType: this.file.mimetype,
      ...JSON.parse(fields.object),
      id: objectId,
      attributedTo: this.actor.id,
    };

    this.activity = {
      '@context': ACTIVITYSTREAMS_CONTEXT,
      to: new URL(PUBLIC_ACTOR),
      type: 'Create',
      id: activityId,
      url: activityId,
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
