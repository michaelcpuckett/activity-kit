import { FirebaseAuthAdapter } from '.';
export declare function authenticatePassword(this: FirebaseAuthAdapter, email: string, password: string): Promise<{
    uid: string;
    token: string;
} | null>;
