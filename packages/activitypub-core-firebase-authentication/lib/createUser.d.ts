import { FirebaseAuthentication } from '.';
export declare function createUser({ email, password, preferredUsername, }: {
    this: FirebaseAuthentication;
    email: string;
    password: string;
    preferredUsername: string;
}): Promise<import("firebase-admin/lib/auth/user-record").UserRecord>;
