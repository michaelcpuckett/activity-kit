import * as fs from 'fs';
import * as firebaseAdmin from 'firebase-admin';
import type { File } from 'formidable';

export async function upload(file: File) {
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp(this.appOptions);
  }

  await firebaseAdmin.storage().bucket(this.bucket).file(file.newFilename).save(fs.readFileSync(file.filepath));
}