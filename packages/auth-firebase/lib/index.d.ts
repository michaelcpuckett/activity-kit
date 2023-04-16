import type { ServiceAccount } from 'firebase-admin';
import type { AuthAdapter } from '@activity-kit/types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { getTokenByUserId } from './getTokenByUserId';
import { authenticatePassword } from './authenticatePassword';
export declare class FirebaseAuthAdapter implements AuthAdapter {
    params?: {
        [key: string]: unknown;
    };
    constructor(serviceAccount: ServiceAccount, projectId: string);
    authenticatePassword: typeof authenticatePassword;
    createUser: typeof createUser;
    getUserIdByToken: typeof getUserIdByToken;
    getTokenByUserId: typeof getTokenByUserId;
}
