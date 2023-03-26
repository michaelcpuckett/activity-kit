export declare type AuthAdapter = {
    createUser: (this: AuthAdapter, { email, password, preferredUsername, }: {
        email: string;
        password?: string;
        preferredUsername: string;
    }) => Promise<{
        uid: string;
    }>;
    getUserIdByToken: (this: AuthAdapter, token: string) => Promise<string>;
    authenticatePassword: (this: AuthAdapter, email: string, password: string) => Promise<boolean>;
};
