import type { AuthAdapter, DbAdapter } from 'activitypub-core-types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { getTokenByUserId } from './getTokenByUserId';
import { authenticatePassword } from './authenticatePassword';
export declare class SubtleAuthAdapter implements AuthAdapter {
    adapters: {
        db: DbAdapter;
    };
    params: {
        [key: string]: unknown;
    };
    constructor(adapters: {
        db: DbAdapter;
    });
    authenticatePassword: typeof authenticatePassword;
    createUser: typeof createUser;
    getUserIdByToken: typeof getUserIdByToken;
    getTokenByUserId: typeof getTokenByUserId;
}
