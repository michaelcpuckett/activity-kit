import { AuthAdapter, CryptoAdapter } from 'activitypub-core-types';
export declare class AuthLayer {
    getTokenByUserId: (userId: string) => Promise<string>;
    createUser: ({ email, password, preferredUsername, }: {
        email: string;
        password?: string;
        preferredUsername: string;
    }) => Promise<{
        uid: string;
        token: string;
    }>;
    getUserIdByToken: (token: string) => Promise<string>;
    authenticatePassword: (email: string, password: string) => Promise<{
        uid: string;
        token: string;
    } | null>;
    generateKeyPair: () => Promise<{
        privateKey: string;
        publicKey: string;
    }>;
    constructor(adapters: {
        auth: AuthAdapter;
        crypto: CryptoAdapter;
    });
}
