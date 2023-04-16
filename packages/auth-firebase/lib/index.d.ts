import type { ServiceAccount } from 'firebase-admin';
import type { DbAdapter, AuthAdapter } from '@activity-kit/types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { getTokenByUserId } from './getTokenByUserId';
import { authenticatePassword } from './authenticatePassword';
export declare class FirebaseAuthAdapter implements AuthAdapter {
    adapters: {
        db: DbAdapter;
    };
    params: {
        [key: string]: unknown;
    };
    constructor(serviceAccount: ServiceAccount, projectId: string);
    authenticatePassword: typeof authenticatePassword;
    createUser: typeof createUser;
    getUserIdByToken: typeof getUserIdByToken;
    getTokenByUserId: typeof getTokenByUserId;
}
