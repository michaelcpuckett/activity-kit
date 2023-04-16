import { CryptoAuthAdapter } from '.';
export declare function authenticatePassword(this: CryptoAuthAdapter, email: string, password: string): Promise<{
    uid: string;
    token: string;
} | null>;
