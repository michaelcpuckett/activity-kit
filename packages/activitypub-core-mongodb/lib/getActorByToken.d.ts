import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
import { ServiceAccount } from 'firebase-admin';
export declare function getActorByToken(
  this: MongoDatabase,
  token: string,
  credentials: ServiceAccount,
): Promise<AP.Actor | null>;
