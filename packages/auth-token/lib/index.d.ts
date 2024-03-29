import { AuthAdapter, CryptoAdapter, DbAdapter } from '@activity-kit/core';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { getTokenByUserId } from './getTokenByUserId';
import { authenticatePassword } from './authenticatePassword';
export declare class TokenAuthAdapter implements AuthAdapter {
    adapters: {
        db: DbAdapter;
        crypto: CryptoAdapter;
    };
    params: {
        [key: string]: unknown;
    };
    constructor(adapters: {
        db: DbAdapter;
        crypto: CryptoAdapter;
    });
    authenticatePassword: typeof authenticatePassword;
    createUser: typeof createUser;
    getUserIdByToken: typeof getUserIdByToken;
    getTokenByUserId: typeof getTokenByUserId;
}
