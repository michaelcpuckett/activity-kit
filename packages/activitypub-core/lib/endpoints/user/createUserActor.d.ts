import { DatabaseService } from '../../DatabaseService';
export declare function createUserActor(databaseService: DatabaseService, user: {
    uid: string;
    email: string;
    name: string;
    preferredUsername: string;
}): Promise<void>;
