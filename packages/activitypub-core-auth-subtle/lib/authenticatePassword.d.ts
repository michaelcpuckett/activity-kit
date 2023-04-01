import { SubtleAuthAdapter } from '.';
export declare function authenticatePassword(this: SubtleAuthAdapter, email: string, password: string): Promise<{
    uid: string;
    token: string;
} | null>;
