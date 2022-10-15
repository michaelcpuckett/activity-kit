import { MongoDatabase } from '.';
import { ServiceAccount } from 'firebase-admin';
export declare function getAuthenticatedUserIdByToken(this: MongoDatabase, token: string, serviceAccount: ServiceAccount): Promise<string | null>;
