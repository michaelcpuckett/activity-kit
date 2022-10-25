import * as firebaseAdmin from 'firebase-admin';
import { AppOptions, ServiceAccount } from 'firebase-admin';
import type { Storage } from 'activitypub-core-types';
import { upload } from './upload';

export class FirebaseStorage implements Storage {
  appOptions: AppOptions;
  bucketName: string;

  public upload = upload;

  constructor(serviceAccount: ServiceAccount, projectId: string, storageUrl: string, bucketName: string) {
    this.appOptions = {
      credential: firebaseAdmin.credential.cert(serviceAccount),
      projectId,
      storageBucket: storageUrl,
    };
    this.bucketName = bucketName;
  }
}
