import { DatabaseService } from '.';
import { ServiceAccount } from 'firebase-admin';
export declare function getAuthenticatedUserIdByToken(this: DatabaseService, token: string, serviceAccount: ServiceAccount): Promise<string | null>;
