import { AppOptions, ServiceAccount } from 'firebase-admin';
import type { AuthAdapter } from 'activitypub-core-types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
export declare class FirebaseAuthAdapter implements AuthAdapter {
    appOptions: AppOptions;
    constructor(serviceAccount: ServiceAccount, projectId: string);
    createUser: typeof createUser;
    getUserIdByToken: typeof getUserIdByToken;
}
