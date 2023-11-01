import { TokenAuthAdapter } from '.';
export declare function createUser(this: TokenAuthAdapter, { email, password, preferredUsername, }: {
    email: string;
    password: string;
    preferredUsername: string;
}): Promise<{
    uid: string;
    token: string;
}>;
