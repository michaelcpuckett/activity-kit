import { TokenAuthAdapter } from '.';
export declare function authenticatePassword(this: TokenAuthAdapter, email: string, password: string): Promise<{
    uid: string;
    token: string;
} | null>;
