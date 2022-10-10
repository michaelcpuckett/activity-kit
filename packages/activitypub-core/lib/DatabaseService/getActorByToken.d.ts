import { DatabaseService } from '.';
import { AP } from '../types';
import { ServiceAccount } from 'firebase-admin';
export declare function getActorByToken(this: DatabaseService, token: string, credentials: ServiceAccount): Promise<AP.Actor | null>;
