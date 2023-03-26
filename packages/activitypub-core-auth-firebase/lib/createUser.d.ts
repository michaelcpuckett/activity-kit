import { FirebaseAuthAdapter } from '.';
export declare function createUser(this: FirebaseAuthAdapter, { email, password, preferredUsername, }: {
    email: string;
    password?: string;
    preferredUsername: string;
}): Promise<import("firebase-admin/lib/auth/user-record").UserRecord>;
