import { SubtleAuthAdapter } from '.';
export declare function createUser(this: SubtleAuthAdapter, { email, password, preferredUsername, }: {
    email: string;
    password?: string;
    preferredUsername: string;
}): Promise<{
    uid: string;
    token: string;
}>;
