import { UserPostEndpoint } from '.';
export declare function createUserActor(this: UserPostEndpoint, user: {
    uid: string;
    type: string;
    email: string;
    name: string;
    preferredUsername: string;
}): Promise<void>;
