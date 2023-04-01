import { CryptoAuthAdapter } from '.';
export declare function createUser(this: CryptoAuthAdapter, { email, password, preferredUsername, }: {
    email: string;
    password?: string;
    preferredUsername: string;
}): Promise<{
    uid: string;
    token: string;
}>;
