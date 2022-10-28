import { FirebaseAuthenticationAdapter } from '.';
export declare function createUser({ email, password, preferredUsername, }: {
    this: FirebaseAuthenticationAdapter;
    email: string;
    password: string;
    preferredUsername: string;
}): Promise<import("firebase-admin/lib/auth/user-record").UserRecord>;
