import { AppOptions, ServiceAccount } from 'firebase-admin';
import type { AuthAdapter } from 'activitypub-core-types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { authenticatePassword } from './authenticatePassword';
export declare class FirebaseAuthAdapter implements AuthAdapter {
    appOptions: AppOptions;
    constructor(serviceAccount: ServiceAccount, projectId: string);
    authenticatePassword: typeof authenticatePassword;
    createUser: typeof createUser;
    getUserIdByToken: typeof getUserIdByToken;
}
