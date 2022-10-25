import { AppOptions, ServiceAccount } from 'firebase-admin';
import type { Storage } from 'activitypub-core-types';
import { upload } from './upload';
export declare class FirebaseStorage implements Storage {
    appOptions: AppOptions;
    upload: typeof upload;
    constructor(serviceAccount: ServiceAccount, projectId: string, storageBucket: string);
}
