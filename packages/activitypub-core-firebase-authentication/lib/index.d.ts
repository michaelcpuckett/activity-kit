import { AppOptions, ServiceAccount } from 'firebase-admin';
import type { Auth } from 'activitypub-core-types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
export declare class FirebaseAuthentication implements Auth {
    appOptions: AppOptions;
    constructor(serviceAccount: ServiceAccount, projectId: string);
    createUser: typeof createUser;
    getUserIdByToken: typeof getUserIdByToken;
}
