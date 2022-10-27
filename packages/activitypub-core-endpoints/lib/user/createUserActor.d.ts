import type { Database, Plugin } from 'activitypub-core-types';
export declare function createUserActor(databaseService: Database, user: {
    uid: string;
    email: string;
    name: string;
    preferredUsername: string;
}, plugins?: Plugin[]): Promise<void>;
